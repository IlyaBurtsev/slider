import { SliderDomControllerOptions } from '../../models/interfaces/SliderDomControllerOptions';
import { Orientation } from '../../models/Orientation';
import SliderLisrener from './SliderListener';

export default class SliderDomController {
  private sliderElement: HTMLElement;
  private orientation: number;
  private callback: (parametrs: SliderParametrs) => void;

  constructor(options: SliderDomControllerOptions) {
    const { viewConnector, subscribeToTouchHandler, callback, trigger, getEventNames } = options;
    this.sliderElement = viewConnector.slider;
    this.callback = callback;
		callback(this.getSliderParametrs());
    new SliderLisrener(this.sliderElement, this.orientation, getEventNames, trigger); 
    subscribeToTouchHandler(this.onTouchHandler);
  }

  private onTouchHandler = (): void => {
    this.callback(this.getSliderParametrs());
  };

  private getSliderParametrs = (): SliderParametrs => {
    const rect = this.sliderElement.getBoundingClientRect();
		if (rect.width > rect.height) {
			this.orientation = Orientation.Horizontal
		} else {
			this.orientation = Orientation.Vertical
		}

    if (this.orientation === Orientation.Horizontal) {
      return {
				orientation: this.orientation,
        sliderLength: rect.width,
        sliderStartPosition: rect.left,
        sliderEndPosition: rect.left + rect.width,
      };
    } else {
      return {
				orientation: this.orientation,
        sliderLength: rect.height,
        sliderStartPosition: rect.top,
        sliderEndPosition: rect.top + rect.height,
      };
    }
  };
}
