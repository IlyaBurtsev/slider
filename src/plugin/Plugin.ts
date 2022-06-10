import DataController from './data-controller/DataController';
import SliderDomController from './slider/SliderDomController';
import HandlersDomController from './handler/HandlersDomController';
import progressBarDomController from './progress-bar/ProgressBarDomController';
import { Orientation } from '../models/Orientation';
import { PluginActions } from '../models/PluginActions';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';
import TooltipDomController from './tooltip/TooltipDomController';

class Plugin extends Observer {
  private dataController: DataController;
  private state: RootState;
  private options: SliderOptions = {
    orientation: Orientation.Horizontal,
    isDraggableRange: false,
    numberOfDraggableRanges: 1,
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

	public updateOptions = (newOptions?: InitOptions): void =>{
    if (newOptions) {
      this.options = deepMerge(this.options, newOptions);
    }
  }

  private init(viewConnector: ViewConnector): void {
    const { slider } = viewConnector;
    const { orientation, isDraggableRange, numberOfDraggableRanges } = this.options;

    this.dataController = new DataController(this.options);

    const sliderDomController = new SliderDomController(slider, orientation, this.dataController.getSliderParametrs);
    this.dataController.getSliderParametrs = sliderDomController.getSliderParametrs;

    const handlersDomContrtoller = new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: isDraggableRange ? numberOfDraggableRanges * 2 : 1,
        trigger: this.newTrigger,
        subscribeToChangeState: this.addStateSubscriber,
      },
      this.dataController.setHandlerParametrs
    );

    new progressBarDomController({
      viewConnector: viewConnector,
      orientation: orientation,
      isDraggableRange: isDraggableRange,
      numberOfDraggableRanges: numberOfDraggableRanges,
      handlerLength: this.dataController.getHandlerLength(),
      subscribeToChangeState: this.addStateSubscriber,
    });

    new TooltipDomController({
      viewConnector: viewConnector,
      handlerElements: handlersDomContrtoller.getHandlerElements(),
      subscribeToChangeState: this.addStateSubscriber,
      subscribeToTouchHandler: this.addOnTouchSubscriber,
      subscribeToStopMovingHandler: this.addOnStopMovingSubscriber,
    });

    this.state = this.dataController.initState();
    this.newTrigger(PluginActions.onChangeState, this.state);
    this.on(PluginActions.onTouchHandler, this.onTouchHandler);
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

  private newTrigger = (actions: PluginActions, ...args: Array<Object>): void => {
    this.trigger(actions, ...args);
  };

  private addStateSubscriber = (handler: (state?: RootState, id?: number) => void): void => {
    this.on(PluginActions.onChangeState, handler);
  };

  private addOnTouchSubscriber = (handler: (id?: number) => void): void => {
    this.on(PluginActions.onTouchHandler, handler);
  };

  private addOnStopMovingSubscriber = (handler: (id?: number) => void): void => {
    this.on(PluginActions.onStopMoving, handler);
  };
}

const createSliderPlugin = (viewConnector: ViewConnector, options?: UserOptions): API => {
  const { slider } = viewConnector;
  const rect = viewConnector.slider.getBoundingClientRect();

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

  const sliderPlugin = new Plugin(viewConnector, options);
  const api: API = {
		updateSliderOptions: sliderPlugin.updateOptions
	};
  return api;
};

export { createSliderPlugin };
