import { Orientation } from '../../models/Orientation';

export default class SliderDomController {
  private sliderElement: HTMLElement;
  private orientation: number;

  constructor(slider: HTMLElement, orientation: number, callback: () => SliderParametrs) {
    this.sliderElement = slider;
    this.orientation = orientation;
    callback = this.getSliderParametrs;
  }

  public getSliderParametrs = (): SliderParametrs =>{
    const rect = this.sliderElement.getBoundingClientRect();

    if (this.orientation === Orientation.Horizontal) {
      return {
        sliderLength: rect.width,
        sliderStartPosition: rect.left,
        sliderEndPosition: rect.left + rect.width,
      };
    } else {
      return {
        sliderLength: rect.height,
        sliderStartPosition: rect.top,
        sliderEndPosition: rect.top + rect.height,
      };
    }
  }
}
