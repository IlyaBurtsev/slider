import Orientation from '../../models/enums/Orientation';
import { ScaleOptions } from '../../models/types';
import { ViewConnector } from '../../models/ViewConnector';

export default class ScaleCreator {
  private markersElements: Array<HTMLElement> = [];

  private scaleSize: number;

  // eslint-disable-next-line no-unused-vars
  constructor(viewConnector: ViewConnector, options: ScaleOptions, subscribeToDestroy: (handler: () => void) => void) {
    const { callback } = options;
    this.createScale(viewConnector, options);
    callback(this.scaleSize);
    subscribeToDestroy(this.onDestroy);
  }

  private createScale = (viewConnector: ViewConnector, options: ScaleOptions): void => {
    const { numberOfSteps, scaleStep, sliderLength, handlerBottom, handlerTop, orientation } = options;
    const { scaleElements } = viewConnector;
    if (scaleElements === undefined) {
      return;
    }

    const { markerLarge, markerDefault, scale } = scaleElements;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i <= numberOfSteps; i += 1) {
      if (i % scaleStep === 0) {
        const newMarker = markerLarge.cloneNode(true) as HTMLElement;
        fragment.append(newMarker);
        this.markersElements.push(newMarker);
      } else {
        const newMarker = markerDefault.cloneNode(true) as HTMLElement;
        fragment.append(newMarker);
        this.markersElements.push(newMarker);
      }
    }
    scale.append(fragment);
    const rect = scale.getBoundingClientRect();
    if (orientation === Orientation.Horizontal) {
      scale.style.width = `${sliderLength}px`;
      scale.style.top = `${handlerBottom + 1}px`;
      this.scaleSize = rect.height;
    } else {
      scale.style.height = `${sliderLength}px`;
      scale.style.left = `${handlerTop - rect.width - 1}px`;
      scale.style.top = '0';
      this.scaleSize = rect.width;
    }
  };

  private onDestroy = (): void => {
    this.markersElements.forEach((element) => element.remove());
  };
}
