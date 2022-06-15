import DataController from './data-controller/DataController';
import SliderDomController from './slider/SliderDomController';
import HandlersDomController from './handler/HandlersDomController';
import ProgressBarDomController from './progress-bar/ProgressBarDomController';
import TooltipDomController from './tooltip/TooltipDomController';
import { PluginActions } from '../models/PluginActions';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';
import { ChangeStateTypes } from '../models/ChangeStateTypes';

class Plugin extends Observer {
  private dataController: DataController;
  private state: RootState;

  constructor(viewConnector: ViewConnector, newOptions?: UserOptions) {
    super();
    this.init(viewConnector, newOptions);
  }

  private init(viewConnector: ViewConnector, newOptions?: UserOptions): void {
    this.dataController = new DataController(this.newTrigger, newOptions);

    new SliderDomController({
      viewConnector: viewConnector,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      callback: this.dataController.setSliderParametrs,
      getEventNames: this.dataController.getEventNames,
      trigger: this.newTrigger,
    });

    const handlersDomContrtoller = new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: this.dataController.getOrientation(),
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: this.dataController.getNumberOfHandlers(),
        getEventNames: this.dataController.getEventNames,
        trigger: this.newTrigger,
        subscribeToChangeState: this.getStateSubscriber,
        subscribeToDestroy: this.addOnDestroySubscriber,
      },
      this.dataController.setHandlerParametrs
    );

    new ProgressBarDomController({
      viewConnector: viewConnector,
      orientation: this.dataController.getOrientation(),
      numberOfHandlers: this.dataController.getNumberOfHandlers(),
      handlerLength: this.dataController.getHandlerLength(),
      subscribeToChangeState: this.getStateSubscriber,
      subscribeToDestroy: this.addOnDestroySubscriber,
    });

    new TooltipDomController({
      viewConnector: viewConnector,
      handlerElements: handlersDomContrtoller.getHandlerElements(),
      subscribeToChangeState: this.getStateSubscriber,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      subscribeToStopMovingHandler: this.getOnStopMovingSubscriber,
      subscribeToDestroy: this.addOnDestroySubscriber,
    });

    this.state = this.dataController.initState();
    this.newTrigger(PluginActions.onChangeState, this.state);
    this.on(PluginActions.onTouchHandler, this.onTouchHandler);
    this.on(PluginActions.onTouchSlider, this.onTouchSlider);
    this.on(PluginActions.onChangeValue, this.onChangeValue);
    this.on(PluginActions.onDestroy, this.onDestroy);
  }

  private onTouchHandler = (handlerId: number): void => {
    this.on(PluginActions.onMoveHandler, this.onMoveHandler);
    this.on(PluginActions.onStopMoving, this.onStopMoving);
  };

  private onTouchSlider = this.changeStateMethodCreator(ChangeStateTypes.tapOnSlider);

  private onChangeValue = this.changeStateMethodCreator(ChangeStateTypes.externalChangeValue);

  private onMoveHandler = this.changeStateMethodCreator(ChangeStateTypes.handlerMovement);

  private onStopMoving = (handlerId: number): void => {
    this.off(PluginActions.onMoveHandler, this.onMoveHandler);
    this.off(PluginActions.onStopMoving, this.onStopMoving);
    this.dataController.updateLimits(this.state.handlerStates);
  };

  private onDestroy = (): void => {
    this.onMoveHandler(this.dataController.getHandlerStartPosition(), 0);
  };

  private newTrigger = (actions: PluginActions, ...args: Array<Object>): void => {
    this.trigger(actions, ...args);
  };

  private getStateSubscriber = (handler: (state?: RootState, id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      this.on(PluginActions.onChangeState, handler);
    } else {
      this.off(PluginActions.onChangeState, handler);
    }
  };

  private getOnTouchSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      this.on(PluginActions.onTouchHandler, handler);
    } else {
      this.off(PluginActions.onTouchHandler, handler);
    }
  };

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

  private changeStateMethodCreator(type: ChangeStateTypes): (newUserPosition: number, handlerId: number) => void {
    return (newUserPosition: number, handlerId: number): void => {
      this.state = this.dataController.changeState(this.state, newUserPosition, handlerId, type);
    };
  }
}

const createSliderPlugin = (viewConnector: ViewConnector, options?: UserOptions): API => {
  const view = viewConnector;
  const handlers: Map<PluginActions, Function> = new Map();
	let userOptions: UserOptions |undefined = options

  let sliderPlugin = new Plugin(view, options);

  const getOnTouchSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      sliderPlugin.on(PluginActions.onTouchHandler, handler);
      handlers.set(PluginActions.onTouchHandler, handler);
    } else {
      sliderPlugin.off(PluginActions.onTouchHandler, handler);
    }
  };

  const getOnStopMovingSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      sliderPlugin.on(PluginActions.onStopMoving, handler);
      handlers.set(PluginActions.onStopMoving, handler);
    } else {
      sliderPlugin.off(PluginActions.onStopMoving, handler);
    }
  };

	const getStateSubscriber = (handler: (state?: RootState, id?: number) => void, subscribe = true): void => {
    if (subscribe) {
      sliderPlugin.on(PluginActions.onChangeState, handler);
			handlers.set(PluginActions.onChangeState, handler);
    } else {
      sliderPlugin.off(PluginActions.onChangeState, handler);
    }
  };

  const updateSliderOptions = (options: UserOptions): void => {
		if (userOptions !== undefined) {
			userOptions = deepMerge(userOptions, true, options);
		} else {
			userOptions = options
		}
    sliderPlugin.trigger(PluginActions.onDestroy);
    sliderPlugin = new Plugin(view, options);
    handlers.forEach((hanler, actions) => sliderPlugin.on(actions, hanler));
  };

  const moveHandler = (value: number, handlerIndex: number): void => {
    sliderPlugin.trigger(PluginActions.onChangeValue, value, handlerIndex);
  };

  const api: API = {
    updateSliderOptions: updateSliderOptions,
    moveHandlerTo: moveHandler,
    subscribeToChangeState: getStateSubscriber,
    subscribeToGetStarted: getOnTouchSubscriber,
    subscribeToTheEndOfTheMovement: getOnStopMovingSubscriber,
  };
  return api;
};

export { createSliderPlugin };
