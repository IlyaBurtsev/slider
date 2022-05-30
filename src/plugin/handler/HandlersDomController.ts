import { Handler } from '../../models/Handler';
import { Orientation } from '../../models/Orientation';
import { Observer } from '../observer/Observer';
import { HandlerListener } from './HandlerListener';

class HandlersDomController extends Observer {
  private orientation: number;
  private handlers: Array<HTMLElement> = [];
  private startHandlerLength: number;
  private endHandlerLength: number | null;
  private handlerMinTranslate: number;
  private handlerMaxTranslate: number;

  private customEvents = {
    onTouchHandler: 'onTouchHandler',
    onMoveHandler: 'onMoveHandler',
    onStopMoving: 'onStopMoving',
  };

  constructor(options: HandlerOptions, callback: Function) {
    super();
    this.init(options);
    callback(this.getHandlersParametrs(options));
  }

  private init(options: HandlerOptions): void {
    const { orientation } = options;
    this.orientation = orientation;
    // const handlerElements = this.createHandlers(options);
    // handlerElements.forEach((handler, id) => {
    // this.prepareHandler(handler, id, position);
    // new HandlerListener(handler, id, orientation, trigger, this.customEvents);
    // }
    // );
  }

  private getHandlersParametrs = (options: HandlerOptions): HandlerParametrs => {
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

  // private createHandlers = (options: HandlerOptions): Array<HTMLElement> => {
  //   const handlers: Array<HTMLElement> = [];
  //   const { numberOfHandlers, viewConnector, orientation, sliderLength } = options;
  //   const { startHandlerElement, endHandlerElement } = viewConnector;
  //   if (!endHandlerElement) {
  //     for (let i = 0; i < numberOfHandlers; i++) {
  //       const newHandler = startHandlerElement.cloneNode(true) as HTMLElement;
  //       handlers.push(newHandler);
  //     }
  //     // this.writeHandlerParametrs(orientation, handlers[0], true, sliderLength);
  //   } else {
  //     let newHandler: HTMLElement;
  //     for (let i = 0; i < numberOfHandlers; i++) {
  //       if (i % 2 === 0) {
  //         newHandler = startHandlerElement.cloneNode(true) as HTMLElement;
  //       } else {
  //         newHandler = endHandlerElement.cloneNode(true) as HTMLElement;
  //       }
  //       handlers.push(newHandler);
  //     }
  //     // this.writeHandlerParametrs(orientation, handlers[1], true);
  //   }
  //   return handlers;
  // };

  private prepareHandler = (handler: HTMLElement, id: number, position?: number): void => {
    this.setHandlerId(handler, id);
    if (position) {
      this.moveHandlerToPosition(id, position);
    }
  };

  public moveHandlerToPosition = (id: number, newPosition: number): void => {
    if (this.orientation === Orientation.Horizontal) {
      this.handlers[id].style.left = `${newPosition}px`;
    } else {
      this.handlers[id].style.top = `${newPosition}px`;
    }
  };

  private setHandlerId(handler: HTMLElement, id: number): void {
    handler.setAttribute('handler-id', `${id}`);
  }

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

export { HandlersDomController };
