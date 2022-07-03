import Orientation from '../../models/enums/Orientation';
import { BarDomControllerOptions, HandlerState, RootState } from '../../models/types';
import { removeElementsFromDom } from '../utils/utils';

export default class ProgressBarDomController {
  private bars: Array<HTMLElement>;

  private orientation: number;

  private handlerLength: number;

  private numberOfHandlers: number;

  constructor(options: BarDomControllerOptions) {
    this.init(options);
  }

  private init(options: BarDomControllerOptions): void {
    const {
      viewConnector,
      numberOfHandlers,
      orientation,
      handlerLength,
      createProgressBar,
      subscribeToChangeState,
      subscribeToDestroy,
    } = options;
    const { progressBar } = viewConnector;
    this.orientation = orientation;
    this.handlerLength = handlerLength;
    this.numberOfHandlers = numberOfHandlers;
    function initBars(): Array<HTMLElement> {
      if (progressBar !== undefined) {
				if (orientation === Orientation.Horizontal){
					progressBar.style.width = '0';
				} else {
					progressBar.style.height = '0';
				}    
        const elements: Array<HTMLElement> = [progressBar];
        if (numberOfHandlers > 1) {
          const fragment = document.createDocumentFragment();
          for (let i = 1; i < numberOfHandlers; i += 1) {
            if (i % 2 === 0) {
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
    this.bars = initBars();
    if (createProgressBar) {
      subscribeToChangeState(this.onChangeState);
    }
    subscribeToDestroy(this.onDestroy);
  }

  private onChangeState = (state: RootState, id: number): void => {
    let barId: number = 0;
    let length;
    let startPosition: number;

    function setBarParametrs(index: number, handlerState: HandlerState, that: ProgressBarDomController): void {
      const isStartElement = index % 2 === 0;
      const { minTranslate, position, maxTranslate } = handlerState;
      barId = Math.floor(index / 2);
      if (isStartElement) {
        startPosition = position;
        length = maxTranslate + that.handlerLength * 1.5 - position;
      } else {
        length = position - minTranslate + that.handlerLength * 1.5;
      }

      that.updateBarView(that.bars[barId], startPosition, length);
    }
    if (this.numberOfHandlers === 1) {
      length = state.handlerStates[0].position + 0.5 * this.handlerLength;
      if (state.handlerStates[0].position <= 0) {
        length = 0;
      }
      this.updateBarView(this.bars[0], 0, length);
    } else if (id === undefined) {
      state.handlerStates.forEach((handlerState, index) => {
        setBarParametrs(index, handlerState, this);
      });
    } else {
      setBarParametrs(id, state.handlerStates[id], this);
    }
  };

  private onDestroy = (): void => {
    removeElementsFromDom(this.bars, 1);
		if (this.orientation === Orientation.Horizontal) {
			this.bars[0].style.width = '0';
		}else {
			this.bars[0].style.height = '0';
		}
   
  };

  private updateBarView = (bar: HTMLElement, startPosition?: number, length?: number): void => {
    if (startPosition !== undefined) {
      if (this.orientation === Orientation.Horizontal) {
        // eslint-disable-next-line no-param-reassign
        bar.style.left = `${startPosition}px`;
      } else {
        // eslint-disable-next-line no-param-reassign
        bar.style.top = `${startPosition}px`;
      }
    }
    if (length !== undefined) {
      if (this.orientation === Orientation.Horizontal) {
        // eslint-disable-next-line no-param-reassign
        bar.style.width = `${length}px`;
      } else {
        // eslint-disable-next-line no-param-reassign
        bar.style.height = `${length}px`;
      }
    }
  };
}
