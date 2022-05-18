import './example.scss'
import '../src/components/slider/slider'

import { getElement } from '../src/utils/utils'
import { createSlider } from '../src/components/slider/slider';
import { createHandler } from '../src/components/handler/handler'

const sliderContainer = getElement('.slider');
const slider = createSlider();
slider.append(createHandler());
sliderContainer?.append(slider)