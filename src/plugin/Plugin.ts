import DataController from './data-controller/DataController';
import SliderDomController from './slider/SliderDomController';
import HandlersDomController from './handler/HandlersDomController';
import ProgressBarDomController from './progress-bar/ProgressBarDomController';
import TooltipDomController from './tooltip/TooltipDomController';
import { Orientation } from '../models/Orientation';
import { PluginActions } from '../models/PluginActions';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';

class Plugin extends Observer {
  private dataController: DataController;
  private state: RootState;
  private options: SliderOptions = {
    orientation: Orientation.Horizontal,
    numberOfHandlers: 1,
    minValue: 0,
    maxValue: 100,
    startValues: [],
    step: 1,
  };

  constructor(viewConnector: ViewConnector, newOptions?: InitOptions) {
    super();
    this.updateOptions(newOptions);
    this.init(viewConnector);
  }

  private updateOptions = (newOptions?: InitOptions): void => {
    if (newOptions) {
      this.options = deepMerge(this.options, newOptions);
    }
  };

  private init(viewConnector: ViewConnector): void {
    const { orientation, numberOfHandlers } = this.options;

    this.dataController = new DataController(this.options);

    new SliderDomController({
      viewConnector: viewConnector,
      orientation: orientation,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      callback: this.dataController.setSliderParametrs,
    });

    const handlersDomContrtoller = new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: numberOfHandlers,
        trigger: this.newTrigger,
        subscribeToChangeState: this.addStateSubscriber,
				subscribeToDestroy: this.addOnDestroySubscriber,
      },
      this.dataController.setHandlerParametrs
    );

    new ProgressBarDomController({
      viewConnector: viewConnector,
      orientation: orientation,
      numberOfHandlers: numberOfHandlers,
      handlerLength: this.dataController.getHandlerLength(),
      subscribeToChangeState: this.addStateSubscriber,
			subscribeToDestroy: this.addOnDestroySubscriber,
    });

    new TooltipDomController({
      viewConnector: viewConnector,
      handlerElements: handlersDomContrtoller.getHandlerElements(),
      subscribeToChangeState: this.addStateSubscriber,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      subscribeToStopMovingHandler: this.addOnStopMovingSubscriber,
			subscribeToDestroy: this.addOnDestroySubscriber,
    });

    this.state = this.dataController.initState();
    this.newTrigger(PluginActions.onChangeState, this.state);
    this.on(PluginActions.onTouchHandler, this.onTouchHandler);
		this.on(PluginActions.onDestroy, this.onDestroy);
  }

  private onTouchHandler = (handlerId: number): void => {
    this.on(PluginActions.onMoveHandler, this.onMoveHandler);
    this.on(PluginActions.onStopMoving, this.onStopMoving);
  };

  private onMoveHandler = (handlerId: number, newUserPosition: number): void => {
    this.state = this.dataController.changeState(this.state, newUserPosition, handlerId);
    this.trigger(PluginActions.onChangeState, this.state, handlerId);
  };

  private onStopMoving = (handlerId: number): void => {
    this.off(PluginActions.onMoveHandler, this.onMoveHandler);
    this.off(PluginActions.onStopMoving, this.onStopMoving);
    this.dataController.updateLimits(this.state.handlerStates);
  };

	private onDestroy = ():void => {
		this.onMoveHandler(0, this.dataController.getHandlerStartPosition())
	}

  private newTrigger = (actions: PluginActions, ...args: Array<Object>): void => {
    this.trigger(actions, ...args);
  };

  private addStateSubscriber = (handler: (state?: RootState, id?: number) => void): void => {
    this.on(PluginActions.onChangeState, handler);
  };

  private getOnTouchSubscriber = (handler: (id?: number) => void, subscribe = true): void => {
		if (subscribe){
			this.on(PluginActions.onTouchHandler, handler);
		} else {
			this.off(PluginActions.onTouchHandler, handler);
		}
    
  };

  private addOnStopMovingSubscriber = (handler: (id?: number) => void): void => {
    this.on(PluginActions.onStopMoving, handler);
  };

	private addOnDestroySubscriber = (handler: () => void): void => {
    this.on(PluginActions.onDestroy, handler);
  };
}

const createSliderPlugin = (viewConnector: ViewConnector, options?: UserOptions): API => {
  const view = viewConnector;
  const rect = view.slider.getBoundingClientRect();

  if (rect.width > rect.height) {
    if (options === undefined) {
      options = { orientation: Orientation.Horizontal };
    } else {
      options.orientation = Orientation.Horizontal;
    }
  } else {
    if (options === undefined) {
      options = { orientation: Orientation.Vertical };
    } else {
      options.orientation = Orientation.Vertical;
    }
  }
  let initOptions: InitOptions = options;

  let sliderPlugin = new Plugin(view, initOptions);

  const updateSliderOptions = (options: UserOptions): void => {
    initOptions = deepMerge(initOptions, options);
		sliderPlugin.trigger(PluginActions.onDestroy)
    sliderPlugin = new Plugin(view, initOptions);
  };

  const api: API = {
    updateSliderOptions: updateSliderOptions,
  };
  return api;
};

export { createSliderPlugin };
