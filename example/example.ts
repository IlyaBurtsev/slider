import './example.scss'
import '../src/components/slider/slider'

import { getElement } from '../src/plugin/utils/utils'
import { Plugin } from '../src/plugin/SliderPlugin';
import { Orientation } from '../src/models/Orientation';
import { connector } from '../src/components/connector';
import { createSlider } from '../src/components/slider/slider';

const sliderContainer = getElement('.slider');
new Plugin(sliderContainer, connector, {

})

createSlider(sliderContainer);