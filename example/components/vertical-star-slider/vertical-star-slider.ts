import './vertical-star-slider.scss'
import {ViewConnector} from '../../../src/models/ViewConnector'


const initVerticalStarSlider = (bindElement: HTMLElement): ViewConnector => {
	const className = {
		slider: 'vertical-star-slider__container',
		handler: 'vertical-star-slider__handler'
	}
	const handler = <HTMLElement>bindElement.querySelector(`.${className.handler}`);
	
	return {
		slider: handler.parentElement!,
		handlerElement: handler,
		progressBar: handler.nextElementSibling as HTMLElement,
		tooltip: handler.firstElementChild as HTMLElement,
		setValueInTooltip: (tooltip: HTMLElement, value: string):void => {tooltip.innerHTML = value},
	}
}

export default initVerticalStarSlider;