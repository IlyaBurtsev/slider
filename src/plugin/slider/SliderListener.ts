import PluginActions from '../../models/enums/PluginActions';
import { Actions, BrowserEvent } from '../../models/types';
import { bindEvents, getTouchPosition } from '../utils/utils';

export default class SliderLisrener {
  private sliderElement: HTMLElement;

  private orientation: number;

  // eslint-disable-next-line no-unused-vars
  private trigger: (actions: PluginActions, ...args: Array<Object>) => void;

  constructor(
    slider: HTMLElement,
    orientation: number,
    getEventNames: () => Actions,
    // eslint-disable-next-line no-unused-vars
    trigger: (actions: PluginActions, ...args: Array<Object>) => void,
  ) {
    this.sliderElement = slider;
    this.orientation = orientation;
    this.trigger = trigger;
    bindEvents(getEventNames().start.split(' '), this.onTouchSlider, slider);
  }

  private onTouchSlider = (event: BrowserEvent): void => {
    event.stopPropagation();
    const touchPosition = getTouchPosition(event, this.sliderElement, this.orientation);
    this.trigger(PluginActions.onTouchSlider, touchPosition);
  };
}
