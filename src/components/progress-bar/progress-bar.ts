import './progress-bar.scss';
import { addClass, createElement } from '../../plugin/utils/utils';

const className = {
  progresBar: 'progress-bar',
  progresBarVertical: 'progress-bar_vertical',
};

const createProgressBar = (bindElement: HTMLElement): HTMLElement => {
  const progresBar = createElement({ className: className.progresBar });
  bindElement.append(progresBar);
  return progresBar;
};

const createBarVertical = (progressBar: HTMLElement): void => {
  addClass(progressBar, className.progresBarVertical);
};

export { createProgressBar, createBarVertical };
