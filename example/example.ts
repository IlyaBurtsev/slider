import './example.scss'
import '../src/components/slider/slider'

import { getElement } from '../src/plugin/utils/utils'
import { Slider } from '../src/plugin/SliderPlugin';
import { Orientation } from '../src/models/Orientation';
import { connector } from '../src/components/connector';

const sliderContainer = getElement('.slider');
new Slider(sliderContainer, connector, {

})