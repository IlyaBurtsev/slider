import HandlerListener from './HandlerListener';
import Orientation from '../../models/enums/Orientation';
import { removeElementsFromDom } from '../utils/utils';
import { HandlerDomControllerOptions, HandlerParametrs, RootState } from '../../models/types';

export default class HandlersDomController {
  private orientation: number;
	
  private handlerMinTranslate: number;

  private handlerListeners: Array<HandlerListener> = [];

  private handlerElements: Array<HTMLElement> = [];

  // eslint-disable-next-line no-unused-vars
  constructor(options: HandlerDomControllerOptions, callback: (parametrs: HandlerParametrs) => void) {
    const getHandlersParametrs = (): HandlerParametrs => {
      const { viewConnector, orientation, sliderLength } = options;
      const { handlerElement } = viewConnector;
      const handlerParametrs: HandlerParametrs = {
        handlerLength: 0,
        handlerMinTranslate: 0,
        handlerMaxTranslate: 0,
        handlerTop: 0,
        handlerBottom: 0,
      };

      const cs = window.getComputedStyle(handlerElement, null);
      let length: number = 0;
      let translate: number = 0;
      let top: number = 0;
      let height: number = 0;
      if (orientation === Orientation.Horizontal) {
        translate = Number(cs.left.match(/[-\d][0-9]+/));
        length = Number(cs.width.match(/[-\d][0-9]+/));
        top = Number(cs.top.match(/[-\d][0-9]+/));
        height = Number(cs.height.match(/[-\d][0-9]+/));
      } else {
        length = Number(cs.height.match(/[-\d][0-9]+/));
        translate = Number(cs.top.match(/[-\d][0-9]+/));
        top = Number(cs.left.match(/[-\d][0-9]+/));
        height = Number(cs.width.match(/[-\d][0-9]+/));
      }
      this.handlerMinTranslate = translate;
      handlerParametrs.handlerMinTranslate = translate;
      handlerParametrs.handlerLength = length;
      handlerParametrs.handlerMaxTranslate = translate + sliderLength;
      handlerParametrs.handlerTop = top;
      handlerParametrs.handlerBottom = height + top;

      return handlerParametrs;
    };

    callback(getHandlersParametrs());
    this.init(options);
  }

  public getHandlerElements = (): Array<HTMLElement> => {
    return this.handlerElements;
  };

  private init(options: HandlerDomControllerOptions): void {
    const { orientation, subscribeToChangeState, subscribeToDestroy } = options;

    const createElements = (): Array<HTMLElement> => {
      const elements: Array<HTMLElement> = [];
      const { numberOfHandlers, viewConnector } = options;
      const { handlerElement } = viewConnector;
      const fragment = document.createDocumentFragment();

      function pushNewElement(primeElement: HTMLElement) {
        const newElement = primeElement.cloneNode() as HTMLElement;
        elements.push(newElement);
        fragment.append(newElement);
      }

      elements.push(handlerElement);
      for (let i = 1; i < numberOfHandlers; i += 1) {
        pushNewElement(handlerElement);
      }

      handlerElement.parentElement?.append(fragment);

      return elements;
    };
    this.orientation = orientation;
    this.handlerElements = createElements();
    this.addListeners(options);
    subscribeToChangeState(this.onChachangeState);
    subscribeToDestroy(this.onDestroy);
  }

  private addListeners = (options: HandlerDomControllerOptions): void => {
    const { trigger, orientation, getEventNames } = options;
    this.handlerElements.forEach((element, id) => {
      this.handlerListeners.push(new HandlerListener(element, id, orientation, getEventNames, trigger));
    });
  };

  private onChachangeState = (state: RootState, id: number): void => {
    if (id !== undefined) {
      this.moveHandlerToPosition(id, state.handlerStates[id].position - this.handlerMinTranslate);
    } else {
      state.handlerStates.forEach((handlerState, index) =>
        this.moveHandlerToPosition(index, handlerState.position - this.handlerMinTranslate),
      );
    }
  };

  private onDestroy = (): void => {
    removeElementsFromDom(this.handlerElements, 1);
  };

  private moveHandlerToPosition = (id: number, newPosition: number): void => {
    if (this.orientation === Orientation.Horizontal) {
      this.handlerElements[id].style.transform = `translateX(${newPosition}px)`;
    } else {
      this.handlerElements[id].style.transform = `translateY(${newPosition}px)`;
    }
  };
}
