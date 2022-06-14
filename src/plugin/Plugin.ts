import DataController from './data-controller/DataController';
import SliderDomController from './slider/SliderDomController';
import HandlersDomController from './handler/HandlersDomController';
import ProgressBarDomController from './progress-bar/ProgressBarDomController';
import TooltipDomController from './tooltip/TooltipDomController';
import { Orientation } from '../models/Orientation';
import { PluginActions } from '../models/PluginActions';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';
import { ChangeStateTypes } from '../models/ChangeStateTypes';

class Plugin extends Observer {
  private dataController: DataController;
  private state: RootState;
  private options: SliderOptions = {
    orientation: Orientation.Horizontal,
    numberOfHandlers: 1,
    minValue: 0,
    maxValue: 100,
    startValues: 0,
    step: 1,
  };

  constructor(viewConnector: ViewConnector, newOptions?: InitOptions) {
    super();
    this.updateOptions(newOptions);
    this.init(viewConnector);
  }

  private updateOptions = (newOptions?: InitOptions): void => {
    if (newOptions) {
      this.options = deepMerge(this.options, false, newOptions);
    }
  };

  private init(viewConnector: ViewConnector): void {
    this.dataController = new DataController(this.options, this.newTrigger);
    const { orientation, numberOfHandlers } = this.options;

    new SliderDomController({
      viewConnector: viewConnector,
      orientation: orientation,
      subscribeToTouchHandler: this.getOnTouchSubscriber,
      callback: this.dataController.setSliderParametrs,
      getEventNames: this.dataController.getEventNames,
      trigger: this.newTrigger,
    });

    const handlersDomContrtoller = new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: numberOfHandlers,
        getEventNames: this.dataController.getEventNames,
        trigger: this.newTrigger,
        subscribeToChangeState: this.getStateSubscriber,
        subscribeToDestroy: this.addOnDestroySubscriber,
      },
      this.dataController.setHandlerParametrs
    );

    new ProgressBarDomController({
      viewConnector: viewConnector,
      orientation: orientation,
      numberOfHandlers: numberOfHandlers,
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
  const rect = view.slider.getBoundingClientRect();
  const handlers: Map<PluginActions, Function> = new Map();

	const checkOptions = (options?: UserOptions): InitOptions => {
		if (rect.width > rect.height) {
			if (options === undefined) {
				return options = { orientation: Orientation.Horizontal };
			} else {
				options.orientation = Orientation.Horizontal;
			}
		} else {
			if (options === undefined) {
				return options = { orientation: Orientation.Vertical };
			} else {
				options.orientation = Orientation.Vertical;
			}
		}
    let { numberOfHandlers, sliderLimits, step } = options;
		if (numberOfHandlers !== undefined) {
			if (numberOfHandlers > 1 && numberOfHandlers % 2 !== 0) {
				numberOfHandlers =1;
				options.numberOfHandlers = 1;
			}
			if (sliderLimits !== undefined) {
				let min = sliderLimits[0];
				let max = sliderLimits[1]
				if (sliderLimits.length === 2 && min < max) {
					options.minValue = min;
					options.maxValue = max;
					if(step !== undefined) {
						if((max -min)/numberOfHandlers <= step) {
							options.step = step/10
						}
					}else {
						if((max -min)/numberOfHandlers <= 1) {
							options.step = 0.1
						}
					}
				}
			}
		}
		
	
	
    return options;
  };

	let initOptions: InitOptions = checkOptions(options);

  let sliderPlugin = new Plugin(view, initOptions);

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
		let initOptions = checkOptions(options)
    initOptions = deepMerge(initOptions, true, options);
    sliderPlugin.trigger(PluginActions.onDestroy);
    sliderPlugin = new Plugin(view, initOptions);
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
