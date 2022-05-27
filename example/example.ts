import './example.scss'
import '../src/components/slider/slider'

import { getElement } from '../src/plugin/utils/utils'
import { Plugin } from '../src/plugin/SliderPlugin';
import { getViewConnector } from '../src/components/connector';


const sliderContainer = getElement('.slider');
if(sliderContainer) {
	new Plugin(sliderContainer, getViewConnector(sliderContainer))
}



