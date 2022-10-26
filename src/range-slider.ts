import DataController from './plugin/data-controller/DataController';
import SliderDomController from './plugin/slider/SliderDomController';
import HandlersDomController from './plugin/handler/HandlersDomController';
import ProgressBarDomController from './plugin/progress-bar/ProgressBarDomController';
import TooltipDomController from './plugin/tooltip/TooltipDomController';
import ScaleCreator from './plugin/scale/ScaleCreator';
import PluginActions from './models/enums/PluginActions';
import Observer from './plugin/observer/Observer';
import { deepMerge } from './plugin/utils/utils';
import ChangeStateTypes from './models/enums/ChangeStateTypes';
import API from './models/API';
import { HandlerState, RootState } from './models/types';
import { ViewConnector } from './models/ViewConnector';
import { UserOptions } from './models/interfaces';
import getScale from './components/scale/scale';
import getViewConnector from './components/connector';

class Plugin extends Observer {
  private dataController: DataController;

  private sliderController: SliderDomController;

  private handlerController: HandlersDomController;

  private barController: ProgressBarDomController;

  private tooltipController: TooltipDomController;

  private scaleCreator: ScaleCreator;

  private state: RootState;

  constructor(viewConnector: ViewConnector, newOptions?: UserOptions) {
    super();
    this.init(viewConnector, newOptions);
  }

  public getState = (): RootState => {
    return this.state;
  };

  private init(viewConnector: ViewConnector, newOptions?: UserOptions): void {
    this.dataController = new DataController(this.newTrigger, newOptions);

    this.initSliderBase(viewConnector);
    this.initHandlers(viewConnector);
    this.initProgressBar(viewConnector);
    this.initTooltips(viewConnector, this.handlerController);
    this.initScale(viewConnector);

    this.state = this.dataController.initState();
    this.newTrigger(PluginActions.onChangeState, this.state);
    this.on(PluginActions.onTouchHandler, this.onTouchHandler);
    this.on(PluginActions.onTouchSlider, this.onTouchSlider);
    this.on(PluginActions.onChangeValue, this.onChangeValue);
    this.on(PluginActions.onDestroy, this.onDestroy);
  }

  private initSliderBase = (viewConnector: ViewConnector): void => {
    this.sliderController = new SliderDomController({
      viewConnector,
      getPaddingParametrs: this.dataController.getBindElelementPaddingParametrs,
      subscribeToChangeState: this.getStateSubscriber,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      callback: this.dataController.setSliderParametrs,
      getEventNames: this.dataController.getEventNames,
      trigger: this.newTrigger,
    });
  };

  private initHandlers = (viewConnector: ViewConnector): void => {
    this.handlerController = new HandlersDomController(
      {
        viewConnector,
        orientation: this.dataController.getOrientation(),
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: this.dataController.getNumberOfHandlers(),
        getEventNames: this.dataController.getEventNames,
        trigger: this.newTrigger,
        subscribeToChangeState: this.getStateSubscriber,
        subscribeToDestroy: this.addOnDestroySubscriber,
      },
      this.dataController.setHandlerParametrs,
    );
  };

  private initProgressBar = (viewConnector: ViewConnector): void => {
    this.barController = new ProgressBarDomController({
      viewConnector,
      orientation: this.dataController.getOrientation(),
      numberOfHandlers: this.dataController.getNumberOfHandlers(),
      handlerLength: this.dataController.getHandlerLength(),
      createProgressBar: this.dataController.createProgressBar(),
      subscribeToChangeState: this.getStateSubscriber,
      subscribeToDestroy: this.addOnDestroySubscriber,
    });
  };

  private initTooltips = (viewConnector: ViewConnector, handlersContrtoller: HandlersDomController): void => {
    this.tooltipController = new TooltipDomController({
      orientation: this.dataController.getOrientation(),
      viewConnector,
      handlerElements: handlersContrtoller.getHandlerElements(),
      handlerBottom: this.dataController.getHandlerBottom(),
      createTooltips: this.dataController.createTooltips(),
      subscribeToChangeState: this.getStateSubscriber,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      subscribeToStopMovingHandler: this.getOnStopMovingSubscriber,
      subscribeToDestroy: this.addOnDestroySubscriber,
    });
  };

  private initScale = (viewConnector: ViewConnector): void => {
    if (this.dataController.createScale()) {
      this.scaleCreator = new ScaleCreator(
        viewConnector,
        this.dataController.getScaleOptions(),
        this.addOnDestroySubscriber,
      );
    }
  };

  private onTouchHandler = (): void => {
    this.on(PluginActions.onMoveHandler, this.onMoveHandler);
    this.on(PluginActions.onStopMoving, this.onStopMoving);
  };

  private onTouchSlider = this.changeStateMethodCreator(ChangeStateTypes.tapOnSlider);

  private onChangeValue = this.changeStateMethodCreator(ChangeStateTypes.externalChangeValue);

  private onMoveHandler = this.changeStateMethodCreator(ChangeStateTypes.handlerMovement);

  private onStopMoving = (): void => {
    this.off(PluginActions.onMoveHandler, this.onMoveHandler);
    this.off(PluginActions.onStopMoving, this.onStopMoving);
    this.dataController.updateLimits(this.state.handlerStates);
  };

  private onDestroy = (): void => {
    this.onMoveHandler(this.dataController.getHandlerStartPosition(), 0);
    this.removeAllEvents();
  };

  private newTrigger = (actions: PluginActions, ...args: Array<Object>): void => {
    this.trigger(actions, ...args);
  };

  // eslint-disable-next-line no-unused-vars
  private getStateSubscriber = (
    handler: (state?: RootState, id?: number, type?: string) => void,
    subscribe = true,
  ): void => {
    if (subscribe) {
      this.on(PluginActions.onChangeState, handler);
    } else {
      this.off(PluginActions.onChangeState, handler);
    }
  };

  // eslint-disable-next-line no-unused-vars
  private getOnTouchSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      this.on(PluginActions.onTouchHandler, handler);
    } else {
      this.off(PluginActions.onTouchHandler, handler);
    }
  };

  // eslint-disable-next-line no-unused-vars
  private getOnStopMovingSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      this.on(PluginActions.onStopMoving, handler);
    } else {
      this.off(PluginActions.onStopMoving, handler);
    }
  };

  private addOnDestroySubscriber = (handler: () => void): void => {
    this.on(PluginActions.onDestroy, handler);
  };

  // eslint-disable-next-line no-unused-vars
  private changeStateMethodCreator(type: ChangeStateTypes): (newUserPosition: number, handlerId?: number) => void {
    return (newUserPosition: number, handlerId?: number): void => {
      let id: number;
      if (handlerId === undefined) {
        id = -1;
      } else {
        id = handlerId;
      }
      this.state = this.dataController.changeState(type, this.state, newUserPosition, id);
    };
  }
}

const createSliderPlugin = (viewConnector: ViewConnector, options?: UserOptions): API => {
  const view = viewConnector;
  const subscribers: Map<PluginActions, Function> = new Map();
  let userOptions: UserOptions | undefined = options;
  let subscriber: Function;

  let sliderPlugin = new Plugin(view, options);

  // eslint-disable-next-line no-unused-vars
  const getOnTouchSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      sliderPlugin.on(PluginActions.onTouchHandler, handler);
      subscribers.set(PluginActions.onTouchHandler, handler);
    } else {
      sliderPlugin.off(PluginActions.onTouchHandler, handler);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getOnStopMovingSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      sliderPlugin.on(PluginActions.onStopMoving, handler);
      subscribers.set(PluginActions.onStopMoving, handler);
    } else {
      sliderPlugin.off(PluginActions.onStopMoving, handler);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getStateSubscriber = (
    handler: (state?: RootState, id?: number, type?: string) => void,
    subscribe = true,
  ): void => {
    if (subscribe) {
      sliderPlugin.on(PluginActions.onChangeState, handler);
      subscribers.set(PluginActions.onChangeState, handler);
    } else {
      sliderPlugin.off(PluginActions.onChangeState, handler);
    }
  };

  const updateSliderOptions = (newUserOptions: UserOptions): void => {
    if (userOptions !== undefined) {
      userOptions = deepMerge(userOptions, true, newUserOptions);
    } else {
      userOptions = newUserOptions;
    }
    sliderPlugin.trigger(PluginActions.onDestroy);
    sliderPlugin = new Plugin(view, userOptions);
    if (subscriber !== undefined) {
      subscriber(newUserOptions);
    }
    subscribers.forEach((hanler, actions) => sliderPlugin.on(actions, hanler));
  };

  const moveHandler = (value: number, handlerIndex: number): void => {
    sliderPlugin.trigger(PluginActions.onChangeValue, value, handlerIndex);
  };

  const onChangeOptions = (handler: (options: UserOptions) => void, subscribe = true): void => {
    subscriber = handler;
  };
  const getHandlerValue = (id: number): number => {
    return Number(sliderPlugin.getState().valuesState.values[id]);
  };

  const api: API = {
    updateSliderOptions,
    moveHandlerTo: moveHandler,
    subscribeToChangeState: getStateSubscriber,
    subscribeToGetStarted: getOnTouchSubscriber,
    subscribeToTheEndOfTheMovement: getOnStopMovingSubscriber,
    onChangeOptions: onChangeOptions,
    getHandlerValue: getHandlerValue,
  };
  return api;
};

const sliderCreator = {
  createSliderPlugin,
  ChangeStateTypes,
  getViewConnector,
  getScale,
};

export default sliderCreator;
