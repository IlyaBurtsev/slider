import { Orientation } from '../../models/Orientation';
import { removeElementsFromDom } from '../utils/utils';

export default class ProgressBarDomController {
  private bars: Array<HTMLElement>;
  private orientation: number;
  private handlerLength: number;
	private numberOfHandlers: number

  constructor(options: BarDomControllerOptions) {
    this.init(options);
  }

  private init(options: BarDomControllerOptions): void {
    const {
      viewConnector,
      numberOfHandlers,
      orientation,
      handlerLength,
      subscribeToChangeState,
			subscribeToDestroy
    } = options;
    const { progressBar } = viewConnector;
    this.orientation = orientation;
    this.handlerLength = handlerLength;
		this.numberOfHandlers = numberOfHandlers;
    this.bars = initBars();

    subscribeToChangeState(this.onChangeState);
		subscribeToDestroy(this.onDestroy);

    function initBars(): Array<HTMLElement> {
      if (progressBar !== undefined) {
        const elements: Array<HTMLElement> = [progressBar];
        if (numberOfHandlers > 1) {
          const fragment = document.createDocumentFragment();
          for (let i = 1; i < numberOfHandlers; i++) {
						if (i%2 === 0) {
							const newBar = progressBar.cloneNode(true) as HTMLElement;
							fragment.append(newBar);
							elements.push(newBar);
						}
          }
          progressBar.parentElement?.append(fragment);
        }

        return elements;
      }
      return [];
    }
  }

  private onChangeState = (state: RootState, id: number): void => {
    let barId: number = 0;
    let length;
    let startPosition: number;
    if (this.numberOfHandlers === 1) {
      length = state.handlerStates[0].position;
      if (state.handlerStates[0].position === state.handlerStates[0].minTranslate) {
        length = 0;
      }
      this.updateBarView(this.bars[0], 0, length);
    } else {
      if (id === undefined) {
        state.handlerStates.forEach((state, index) => {
          setBarParametrs(index, state, this);
        });
      } else {
        setBarParametrs(id, state.handlerStates[id], this);
      }
    }
    function setBarParametrs(id: number, state: HandlerState, that: ProgressBarDomController): void {
      const isStartElement = id % 2 === 0;
      const { minTranslate, position, maxTranslate } = state;
      barId = Math.floor(id / 2);
      if (isStartElement) {
        startPosition = position;
        length = maxTranslate + that.handlerLength * 1.5 - position;
      } else {
        length = position - minTranslate + that.handlerLength * 1.5;
      }

      that.updateBarView(that.bars[barId], startPosition, length);
    }
  };

	private onDestroy = ():void => {
		removeElementsFromDom(this.bars, 1);
	}

  private updateBarView = (bar: HTMLElement, startPosition?: number, length?: number): void => {
    if (startPosition !== undefined) {
      if (this.orientation === Orientation.Horizontal) {
        bar.style.left = `${startPosition}px`;
      } else {
        bar.style.top = `${startPosition}px`;
      }
    }
    if (length !== undefined) {
      if (this.orientation === Orientation.Horizontal) {
        bar.style.width = `${length}px`;
      } else {
        bar.style.height = `${length}px`;
      }
    }
  };
}
