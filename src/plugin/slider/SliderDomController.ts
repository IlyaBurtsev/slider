import { Orientation } from '../../models/Orientation';

export default class SliderDomController {
  private sliderElement: HTMLElement;
  private orientation: number;
  private callback: (parametrs: SliderParametrs) => void;

  constructor(options: SliderDomControllerOptions) {
    const { viewConnector, orientation, subscribeToTouchHandler, callback } = options;
    this.sliderElement = viewConnector.slider;
    this.orientation = orientation;
    this.callback = callback;
    callback(this.getSliderParametrs());
    subscribeToTouchHandler(this.onTouchHandler);
  }

  private onTouchHandler = (): void => {
    this.callback(this.getSliderParametrs());
  };

  private getSliderParametrs = (): SliderParametrs => {
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
  };
}
