import { Orientation } from '../../models/Orientation';

export default class SliderDomController {

  constructor(slider: HTMLElement, orientation: number, callback: (parametrs: SliderParametrs) => void) {
    callback(this.getSliderParametrs(slider, orientation));
  }

  private getSliderParametrs(slider: HTMLElement, orientation: number): SliderParametrs {
    const rect = slider.getBoundingClientRect();

    if (orientation === Orientation.Horizontal) {
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
