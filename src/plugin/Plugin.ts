import { handlerParametrs, sliderParametrs } from '../../tests/testData/DataForDataController';
import { Orientation } from '../models/Orientation';
import { PluginActionsType } from '../models/PluginActionsType';
import DataController from './DataController';
import HandlersDomController from './handler/HandlersDomController';
import { Observer } from './observer/Observer';
import SliderDomController from './slider/SliderDomController';
import { deepMerge } from './utils/utils';

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
    const { orientation } = this.options;

    this.dataController = new DataController(this.options);

    new SliderDomController(slider, orientation, this.dataController.setSliderParametrs);

    new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: this.dataController.getSliderLength(),
        numberOfHandlers: this.states.length,
        trigger: this.newTrigger,
				subscribeToChangeState: this.addStateSubscriber
      },
      this.dataController.setHandlerParametrs
    );

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
