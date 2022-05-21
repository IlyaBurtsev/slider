import './slider.scss'
import { createElement, getElement } from "../../plugin/utils/utils"

const className = {
	slider: 'slider-plugin',
	handlerContainer: 'slider-plugin__handler-container js-slider-plugin__handler-container',	
}

const selector = {
	handlerContainer: '.js-slider-plugin__handler-container',
}

const createSlider = (bindElement: HTMLElement): HTMLElement => {
	const slider = createElement({className: className.slider});
	const handlerContainer = createElement({className: className.handlerContainer});
	slider.append(handlerContainer);
	bindElement.append(slider);
	return slider;
}

const getHandlerContainer = (slider: HTMLElement):HTMLElement => {
	const container = getElement(selector.handlerContainer, slider);
	if(container) {
		return container;
	} else {
		return slider;
	}
	
}

export {createSlider, getHandlerContainer}