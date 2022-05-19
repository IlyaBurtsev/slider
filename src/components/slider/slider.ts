import './slider.scss'
import { createElement } from "../../plugin/utils/utils"

const createSlider = (): HTMLElement => {
	return createElement({className: 'slider-plugin'});
}


export {createSlider}