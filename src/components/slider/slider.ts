import './slider.scss'

import { createElement} from "../../plugin/utils/utils"
import { createHandler } from '../handler/handler'
import { createProgressBar } from '../progress-bar/progress-bar'

const createSlider = (bindElement: HTMLElement): Array<HTMLElement> => {
	const className = {
		slider: 'slider-plugin',
		handlerContainer: 'slider-plugin__handler-container',	
	}

	const slider = createElement({className: className.slider});
	const handlerContainer = createElement({className: className.handlerContainer});
	const handler = createHandler(handlerContainer);
	const bar = createProgressBar(slider)
	slider.append(handlerContainer);
	bindElement.append(slider);
	return [slider, handler, bar];
}

export {createSlider}