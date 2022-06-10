import './slider.scss';

import { addClass, createElement, removeClass } from '../../plugin/utils/utils';
import { createHandler, createHandlerVertival } from '../handler/handler';
import { createBarVertical, createProgressBar } from '../progress-bar/progress-bar';
import { createScale } from '../scale/scale';
import { createTooltip, createTooltipVertical } from '../tooltip/tooltip';

const createSlider = (bindElement: HTMLElement): Array<HTMLElement> => {
  const className = {
    slider: 'slider-plugin',
		sliderVertical: 'slider-plugin_vertical',
    handlerContainer: 'slider-plugin__handler-container',
    handlerContainerVertical: 'slider-plugin__handler-container_vertical',
  };
  const rect = bindElement.getBoundingClientRect();

  const slider = createElement({ className: className.slider });
  const handlerContainer = createElement({ className: className.handlerContainer });
  const handler = createHandler(handlerContainer);
  slider.append(handlerContainer);
  const bar = createProgressBar(slider);
  const tooltip = createTooltip(handler);
  bindElement.append(slider);
  if (rect.height > rect.width) {
		addClass(slider, className.sliderVertical)
    addClass(handlerContainer, className.handlerContainerVertical);
    createHandlerVertival(handler);
    createTooltipVertical(tooltip);
		createBarVertical(bar);
  }
  return [slider, handler, bar, tooltip];
};

export { createSlider };
