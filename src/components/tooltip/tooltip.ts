import './tooltip.scss'
import { createElement } from '../../plugin/utils/utils';

const createTooltip = (bindElement: HTMLElement): HTMLElement => {
  const className = {
    tooltip: 'tooltip',
  };
  const tooltip = createElement({ className: className.tooltip });
  bindElement.append(tooltip);
  return tooltip;
};

const setValueInTooltip = (tooltip: HTMLElement, value: string): void => {
  tooltip.innerHTML = value;
};

export {createTooltip, setValueInTooltip}
