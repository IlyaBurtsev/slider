import './slider.scss'
import { createElement } from "../../utils/utils"

const createSlider = (): HTMLElement => {
	return createElement({className: 'slider-plugin'});
}


export {createSlider}