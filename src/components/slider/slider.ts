import './slider.scss'

import { createElement} from "../../plugin/utils/utils"
import { createHandler } from '../handler/handler'
import { createProgressBar } from '../progress-bar/progress-bar'
import { createScale } from '../scale/scale'
import { createTooltip } from '../tooltip/tooltip'

const createSlider = (bindElement: HTMLElement): Array<HTMLElement> => {
	const className = {
		slider: 'slider-plugin',
		handlerContainer: 'slider-plugin__handler-container',	
	}

	const slider = createElement({className: className.slider});
	const handlerContainer = createElement({className: className.handlerContainer});
	const handler = createHandler(handlerContainer);
	slider.append(handlerContainer);
	const bar = createProgressBar(slider)
	const tooltip = createTooltip(handler)
	bindElement.append(slider);
	return [slider, handler, bar, tooltip];
}

export {createSlider}