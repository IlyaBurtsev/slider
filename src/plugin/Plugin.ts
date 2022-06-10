import DataController from './data-controller/DataController';
import SliderDomController from './slider/SliderDomController';
import HandlersDomController from './handler/HandlersDomController';
import progressBarDomController from './progress-bar/ProgressBarDomController';
import { Orientation } from '../models/Orientation';
import { PluginActions } from '../models/PluginActions';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';
import TooltipDomController from './tooltip/TooltipDomController';

export default class Plugin extends Observer {
  private dataController: DataController;
  private state: RootState;
  private options: SliderOptions;
  private defaultOptions: SliderOptions = {
    orientation: Orientation.Horizontal,
    isDraggableRange: false,
    numberOfDraggableRanges: 1,
    minValue: 0,
    maxValue: 100,
    startValues: [],
    step: 1,
  };

  constructor(viewConnector: ViewConnector, newOptions?: UserOptions) {
    super();
    this.updateOptions(newOptions);
    this.init(viewConnector);
  }
	
  private init(viewConnector: ViewConnector): void {
    const { slider } = viewConnector;
    const { orientation, isDraggableRange, numberOfDraggableRanges } = this.options;

    this.dataController = new DataController(this.options);

    const sliderDomController = new SliderDomController(slider, orientation, this.dataController.getSliderParametrs);
		this.dataController.getSliderParametrs = sliderDomController.getSliderParametrs
		
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

  private updateOptions(newOptions?: UserOptions): void {
    if (newOptions) {
      this.options = deepMerge(this.defaultOptions, newOptions);
    } else {
      this.options = this.defaultOptions;
    }
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
