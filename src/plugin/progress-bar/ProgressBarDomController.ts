import { Orientation } from '../../models/Orientation';

export default class progressBarDomController {
  private bars: Array<HTMLElement>;
  private barStartTranslate: number = 0;
  private isDraggableRange: boolean;
  private orientation: number;

  constructor(options: BarDomControllerOptions) {
    this.init(options);
  }

  private init(options: BarDomControllerOptions): void {
    const { viewConnector, isDraggableRange, numberOfDraggableRanges, orientation, subscribeToChangeState } = options;
    const { progressBar } = viewConnector;

		this.orientation = orientation
    this.bars = initBars();

    subscribeToChangeState(this.onChangeState);

    function initBars(): Array<HTMLElement> {
      const elements: Array<HTMLElement> = [progressBar];
      if (isDraggableRange) {
        const fragment = document.createDocumentFragment();
        for (let i = 1; i < numberOfDraggableRanges; i++) {
          const newBar = progressBar.cloneNode(true) as HTMLElement;
          fragment.append(newBar);
          elements.push(newBar);
        }
        progressBar.parentElement?.append(fragment);
      }
      return elements;
    }
  }

  private onChangeState = (state: State, handlerId: number): void => {
    const { minTranslate, position, maxTranslate } = state;
		let length: number = 0
		let barId: number = 0
		let startPosition: number = this.barStartTranslate
    if (!this.isDraggableRange) {
      length = position - this.barStartTranslate;
    } else {
      const isStartElement = handlerId % 2 === 0;
      barId = Math.floor(handlerId / 2);
      startPosition = isStartElement ? position : minTranslate;
      length = isStartElement ? maxTranslate : position;
    }
		if(position === minTranslate) {
			length = 0;
		}
		this.updateBarView(this.bars[barId], startPosition, length);
  };

  private updateBarView = (bar: HTMLElement, startPosition: number, length: number): void => {
    if (this.orientation === Orientation.Horizontal) {
      bar.style.left = `${startPosition}px`;
      bar.style.width = `${length}px`;
    } else {
      bar.style.top = `${startPosition}px`;
      bar.style.height = `${length}px`;
    }
  };
}
