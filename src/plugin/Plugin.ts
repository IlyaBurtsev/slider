import { handlerParametrs, sliderParametrs } from '../../tests/testData/DataForDataController';
import { Handler } from '../models/Handler';
import { Orientation } from '../models/Orientation';
import { PluginActionsType } from '../models/PluginActionsType';
import DataController from './DataController';
import HandlersDomController from './handler/HandlersDomController';
import { Observer } from './observer/Observer';
import SliderDomController from './slider/SliderDomController';
import { deepMerge } from './utils/utils';

export default class Plugin extends Observer {
  private handlerController: HandlersDomController;
  private dataController: DataController;
  private handlers: Array<Handler> = [];
  private states: Array<Object>;
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

    new SliderDomController(slider, orientation, (sliderParametrs: SliderParametrs): void => {
      this.dataController.setSliderParametrs(sliderParametrs);
    });
    const handlerDomController = new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: this.dataController.getSliderLength(),
        handlers: this.handlers,
        trigger: this.newTrigger,
      },
      (handlerParametrs: HandlerParametrs) => {
        this.dataController.setHandlerParametrs(handlerParametrs);
      }
    );
    this.handlers = this.dataController.initHandlers();
    handlerDomController.createElements({
      viewConnector: viewConnector,
      orientation: orientation,
      sliderLength: this.dataController.getSliderLength(),
      handlers: this.handlers,
      trigger: this.newTrigger,
    });
    this.dataController.initState();
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
    const handler = this.handlers[handlerId];
    this.on(PluginActionsType.onMoveHandler, this.onMoveHandler);
    this.on(PluginActionsType.onStopMoving, this.onStopMoving);
  };

  private onMoveHandler = (handlerId: number, newUserPosition: number): void => {
    if (handlerId === -1) {
      return;
    }
    const handler = this.handlers[handlerId];
    const position = this.dataController.getHandlerPosition(newUserPosition, handler);

    if (position) {
      this.handlerController.moveHandlerToPosition(handlerId, position);
      handler.setPosition(position);
    }
  };

  private onStopMoving = (handlerId: number): void => {
    const handler = this.handlers[handlerId];

    this.off(PluginActionsType.onMoveHandler, this.onMoveHandler);
    this.off(PluginActionsType.onStopMoving, this.onStopMoving);
  };

  private newTrigger = (actions: PluginActionsType, ...args: Array<Object>): void => {
    this.trigger(actions, ...args);
  };
}
