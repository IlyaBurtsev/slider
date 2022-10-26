import './vertical-star-slider.scss'
import {ViewConnector} from '../../../src/models/ViewConnector'

export type StarWarsSliderComponent = {
	slider: HTMLElement;
	handlerElement: HTMLElement;
	setIMGToHandler: (imgPath: string) => void;
}
const initStarWarsSlider = (bindElement: HTMLElement): StarWarsSliderComponent => {
	const className = {
		slider: 'star-wars-slider__container',
		handler: 'star-wars-slider__handler'
	}
	const handler = <HTMLElement>bindElement.querySelector(`.${className.handler}`);

	const setIMGToHandler = (imgPath: string) => {
		const img=handler.firstElementChild as HTMLImageElement;
		img.src = imgPath;
	}
	
	return {
		slider: handler.parentElement!,
		handlerElement: handler,
		setIMGToHandler
	}
}

export default initStarWarsSlider;