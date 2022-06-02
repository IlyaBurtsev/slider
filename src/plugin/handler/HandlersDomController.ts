import HandlerDomControllerOptions from '../../models/interfaces/HandlerDomControllerOptions';
import HandlerListener from './HandlerListener';
import { Orientation } from '../../models/Orientation';
import { Handler } from '../../models/Handler';

export default class HandlersDomController {
  private orientation: number;
  private handlerElements: Array<HTMLElement> = [];

  constructor(options: HandlerDomControllerOptions, callback: (parametrs: HandlerParametrs) => void) {
    this.init(options);
    callback(this.getHandlersParametrs(options));
    this.createElements(options);

  }

  private init(options: HandlerDomControllerOptions): void {
    const { orientation } = options;
    this.orientation = orientation;
  }

  private getHandlersParametrs = (options: HandlerDomControllerOptions): HandlerParametrs => {
    const { viewConnector, orientation, sliderLength } = options;
    const { startHandlerElement, endHandlerElement } = viewConnector;
    let parametrs = {
      sliderLength: 0,
      startHandlerLength: 0,
      endHandlerLength: null,
      handlerMinTranslate: 0,
      handlerMaxTranslate: 0,
    };
    [startHandlerElement, endHandlerElement].forEach((handler, i) =>
      this.getParametrs(orientation, handler, i, sliderLength, parametrs)
    );
    return parametrs;
  };

  public createElements = (options: HandlerDomControllerOptions): void => {
    const { handlers, viewConnector, orientation, trigger } = options;
    const { startHandlerElement, endHandlerElement } = viewConnector;
		console.log(handlers)
    if (endHandlerElement === undefined) {
      handlers.forEach((handler, id) => {
        const element = this.pushNewElement(handler, startHandlerElement);
        new HandlerListener(element, id, orientation, trigger);
      });
    } else {
      handlers.forEach((handler, index) => {
        if (index % 2 === 0) {
          this.pushNewElement(handler, endHandlerElement);
        } else {
          this.pushNewElement(handler, startHandlerElement);
        }
      });
    }
  };

  private pushNewElement = (handler: Handler, element: HTMLElement): HTMLElement => {
    let newElementHandler: HTMLElement;
    newElementHandler = element.cloneNode(true) as HTMLElement;
    this.moveHandlerToPosition(handler.getId(), handler.getPosition());
    this.handlerElements.push(newElementHandler);
    return newElementHandler;
  };

  public moveHandlerToPosition = (id: number, newPosition: number): void => {
    if (this.orientation === Orientation.Horizontal) {
      this.handlerElements[id].style.left = `${newPosition}px`;
    } else {
      this.handlerElements[id].style.top = `${newPosition}px`;
    }
  };

  private getParametrs = (
    orientation: number,
    handler: HTMLElement | undefined,
    index: number,
    sliderLength: number,
    handlerParametrs: HandlerParametrs
  ): void => {
    if (handler === undefined) {
      return;
    }
    const cs = window.getComputedStyle(handler, null);
    let length: number = 0;
    let translate: number = 0;
    if (orientation === Orientation.Horizontal) {
      translate = Number(cs.left.match(/[-\d][0-9]+/));
      length = Number(cs.width.match(/[-\d][0-9]+/));
    } else {
      length = Number(cs.height.match(/[-\d][0-9]+/));
      translate = Number(cs.top.match(/[-\d][0-9]+/));
    }

    if (index === 1) {
      handlerParametrs.endHandlerLength = length;
      handlerParametrs.handlerMaxTranslate = translate;
    } else {
      handlerParametrs.handlerMinTranslate = translate;
      handlerParametrs.startHandlerLength = length;
      handlerParametrs.handlerMaxTranslate = translate + sliderLength;
    }
  };
}
