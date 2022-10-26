import Orientation from '../../models/enums/Orientation';
import { PaddingParametrs, SliderDomControllerOptions, SliderParametrs } from '../../models/types';
import SliderLisrener from './SliderListener';

export default class SliderDomController {
  private isInit: boolean = true;

  private sliderElement: HTMLElement;

  private sliderHeight: number;

  private sliderListener: SliderLisrener;

  private getPaddingParametrs: () => PaddingParametrs;

  private orientation: number;

  // eslint-disable-next-line no-unused-vars
  private callback: (parametrs: SliderParametrs) => void;

  constructor(options: SliderDomControllerOptions) {
    const {
      viewConnector,
      subscribeToTouchHandler,
      subscribeToChangeState,
      callback,
      trigger,
      getEventNames,
      getPaddingParametrs,
    } = options;
    this.sliderElement = viewConnector.slider;
    this.getPaddingParametrs = getPaddingParametrs;
    this.callback = callback;
    callback(this.getSliderParametrs());
    this.sliderListener = new SliderLisrener(this.sliderElement, this.orientation, getEventNames, trigger);
    subscribeToChangeState(this.onChangeState);
    subscribeToTouchHandler(this.onTouchHandler);
  }

  private onTouchHandler = (): void => {
    this.callback(this.getSliderParametrs());
  };

  private onChangeState = (): void => {
    if (this.isInit) {
      this.isInit = false;
    }
  };

  private getSliderParametrs = (): SliderParametrs => {
    const rect = this.sliderElement.getBoundingClientRect();
    if (rect.width > rect.height) {
      this.orientation = Orientation.Horizontal;
    } else {
      this.orientation = Orientation.Vertical;
    }
    if (this.orientation === Orientation.Horizontal) {
      this.sliderHeight = rect.height;
      return {
        orientation: this.orientation,
        sliderLength: this.sliderElement.clientWidth,
        sliderStartPosition: rect.left,
        sliderEndPosition: rect.left + rect.width,
      };
    }
    this.sliderHeight = rect.width;
    return {
      orientation: this.orientation,
      sliderLength: this.sliderElement.clientHeight,
      sliderStartPosition: rect.top,
      sliderEndPosition: rect.top + rect.height,
    };
  };
}
