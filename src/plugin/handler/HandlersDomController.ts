import HandlerDomControllerOptions from '../../models/interfaces/HandlerDomControllerOptions';
import HandlerListener from './HandlerListener';
import { Orientation } from '../../models/Orientation';
import { removeElementsFromDom } from '../utils/utils';

export default class HandlersDomController {
  private orientation: number;
  private handlerElements: Array<HTMLElement> = [];

  constructor(options: HandlerDomControllerOptions, callback: (parametrs: HandlerParametrs) => void) {
		console.log(options)
    callback(this.getHandlersParametrs(options));
    this.init(options);
  }

  public getHandlerElements = (): Array<HTMLElement> => {
    return this.handlerElements;
  };

  private init(options: HandlerDomControllerOptions): void {
    const { orientation, subscribeToChangeState, subscribeToDestroy} = options;
    this.orientation = orientation;
    this.handlerElements = this.createElements(options);
    this.addListeners(options);
    subscribeToChangeState(this.onChachangeState);
		subscribeToDestroy(this.onDestroy);
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

  private createElements = (options: HandlerDomControllerOptions): Array<HTMLElement> => {
    const elements: Array<HTMLElement> = [];
    const { numberOfHandlers, viewConnector } = options;
    const { startHandlerElement, endHandlerElement } = viewConnector;
    const fragment = document.createDocumentFragment();
    if (endHandlerElement === undefined) {
      elements.push(startHandlerElement);
      for (let i = 1; i < numberOfHandlers; i++) {
        pushNewElement(startHandlerElement);
      }
    } else {
      elements.push(startHandlerElement, endHandlerElement);
      for (let i = 2; i < numberOfHandlers - 1; i++) {
        if (i % 2 === 0) {
          pushNewElement(endHandlerElement);
        } else {
          pushNewElement(startHandlerElement);
        }
      }
    }
    startHandlerElement.parentElement?.append(fragment);

    function pushNewElement(primeElement: HTMLElement) {
      const newElement = primeElement.cloneNode() as HTMLElement;
      elements.push(newElement);
      fragment.append(newElement);
    }
    return elements;
  };

  private addListeners = (options: HandlerDomControllerOptions): void => {
    const { trigger, orientation } = options;
    this.handlerElements.forEach((element, id) => {
      new HandlerListener(element, id, orientation, trigger);
    });
  };

  private onChachangeState = (state: RootState, id: number): void => {
		if(id !== undefined){
			this.moveHandlerToPosition(id, state.handlerStates[id].position);
		} else {
			state.handlerStates.forEach((state, index) => this.moveHandlerToPosition(index, state.position))
		}
    
  };

	private onDestroy = (): void => {
		removeElementsFromDom(this.handlerElements, 1)
	}

  private moveHandlerToPosition = (id: number, newPosition: number): void => {
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
