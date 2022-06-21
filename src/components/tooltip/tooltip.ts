import './tooltip.scss';
import { addClass, createElement } from '../../plugin/utils/utils';

const className = {
  tooltip: 'tooltip',
  tooltipVertical: 'tooltip_vertical',
};

const createTooltip = (bindElement: HTMLElement): HTMLElement => {
  const tooltip = createElement({ className: className.tooltip });
  bindElement.append(tooltip);
  return tooltip;
};

const createTooltipVertical = (tooltip: HTMLElement): void => {
  addClass(tooltip, className.tooltipVertical);
};

const setValueInTooltip = (tooltip: HTMLElement, value: string): void => {
  // eslint-disable-next-line no-param-reassign
  tooltip.innerHTML = value;
};

export { createTooltip, setValueInTooltip, createTooltipVertical };
