import DataController from './DataController';
import SliderDomController from './slider/SliderDomController';
import HandlersDomController from './handler/HandlersDomController';
import { Orientation } from '../models/Orientation';
import { PluginActionsType } from '../models/PluginActionsType';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';
import progressBarDomController from './progress-bar/ProgressBarDomController';

export default class Plugin extends Observer {
  private dataController: DataController;
  private states: Array<State>;
  private options: SliderOptions;
  private defaultOptions: SliderOptions = {
    orientation: Orientation.Horizontal,
    isDraggableRange: false,
    numberOfDraggableRanges: 1,
    minValue: 0,
    maxValue: 100,
    startValues: [],
    step: 0.1,
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

    new SliderDomController(slider, orientation, this.dataController.setSliderParametrs);

    new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: isDraggableRange? numberOfDraggableRanges*2: 1,
        trigger: this.newTrigger,
				subscribeToChangeState: this.addStateSubscriber
      },
      this.dataController.setHandlerParametrs
    );

		new progressBarDomController({
			viewConnector: viewConnector,
			orientation: orientation,
			isDraggableRange: isDraggableRange,
			numberOfDraggableRanges: isDraggableRange? numberOfDraggableRanges*2: 1,
			subscribeToChangeState: this.addStateSubscriber
		})

    this.states = this.dataController.initState();
		this.states.forEach((state, id) => this.newTrigger(PluginActionsType.onChangeState, state, id))
    this.on(PluginActionsType.onTouchHandler, this.onTouchHandler);
  }

  private updateOptions(newOptions?: UserOptions): void {
    if (newOptions) {
      this.options = deepMerge(this.defaultOptions, newOptions);
    } else {
      this.options = this.defaultOptions;
    }
  }

  private onTouchHandler = (handlerId: number): void => {
    this.on(PluginActionsType.onMoveHandler, this.onMoveHandler);
    this.on(PluginActionsType.onStopMoving, this.onStopMoving);
  };

  private onMoveHandler = (handlerId: number, newUserPosition: number): void => {
		let state = this.states[handlerId]
    state = this.dataController.changeState(state, newUserPosition, handlerId);
    this.trigger(PluginActionsType.onChangeState, state, handlerId);
  };

  private onStopMoving = (handlerId: number): void => {

    this.off(PluginActionsType.onMoveHandler, this.onMoveHandler);
    this.off(PluginActionsType.onStopMoving, this.onStopMoving);
  };

  private newTrigger = (actions: PluginActionsType, ...args: Array<Object>): void => {
    this.trigger(actions, ...args);
  };

  private addStateSubscriber = (handler: (state?: State, id?: number) => void): void => {
    this.on(PluginActionsType.onChangeState, handler);
  };

  private removeStateSubscriber = (handler: (state?: State, id?: number) => void): void => {
    this.off(PluginActionsType.onChangeState, handler);
  };
}
