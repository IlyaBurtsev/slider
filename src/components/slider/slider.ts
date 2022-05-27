import './slider.scss'
import { createElement} from "../../plugin/utils/utils"
import { createHandler } from '../handler/handler'

const createSlider = (bindElement: HTMLElement): Array<HTMLElement> => {
	const className = {
		slider: 'slider-plugin',
		handlerContainer: 'slider-plugin__handler-container',	
	}

	const slider = createElement({className: className.slider});
	const handlerContainer = createElement({className: className.handlerContainer});
	const handler = createHandler(handlerContainer);
	slider.append(handlerContainer);
	bindElement.append(slider);
	return [slider, handler];
}

export {createSlider}