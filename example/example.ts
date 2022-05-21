import './example.scss'
import '../src/components/slider/slider'

import { getElement } from '../src/plugin/utils/utils'
import { createSlider } from '../src/components/slider/slider';
import { createHandler } from '../src/components/handler/handler'
import { Slider } from '../src/plugin/SliderPlugin';
import { Orientation } from '../src/models/Orientation';

const sliderContainer = getElement('.slider');
new Slider(sliderContainer, {
	isDraggableRange: true
})