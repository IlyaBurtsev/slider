import { Handler } from '../models/Handler';
import { Orientation } from '../models/Orientation';
import DataController from './DataController';
import { HandlersDomController } from './handler/HandlersDomController';
import { Observer } from './observer/Observer';
import { deepMerge } from './utils/utils';

class Plugin extends Observer {
  private handlerController: HandlersDomController;
  private dataController: DataController;
  private handlers: Array<Handler> = [];
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
    const { orientation } = this.options;
    new HandlersDomController(
      {
        viewConnector: viewConnector,
        orientation: orientation,
        sliderLength: 10000,
      },
      (parametrs: HandlerParametrs) => {
        console.log(parametrs);
      }
    );
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
    this.on(PluginActions.onMoveHandler, this.onMoveHandler);
    this.on(PluginActions.onStopMoving, this.onStopMoving);
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

    this.off(PluginActions.onMoveHandler, this.onMoveHandler);
    this.off(PluginActions.onStopMoving, this.onStopMoving);
  };

  private newTrigger = (event: string, ...args: Array<Object>): void => {
    this.trigger(event, ...args);
  };
}

export { Plugin };
