import './progress-bar.scss'
import { createElement } from '../../plugin/utils/utils';

const createProgressBar = (bindElement: HTMLElement): HTMLElement => {
  const className = {
    progresBar: 'progress-bar',
  };
	const progresBar = createElement({ className: className.progresBar })
  bindElement.append(progresBar);
	return progresBar;
};

export { createProgressBar };
