import './example.scss';
import '../src/components/slider/slider';

import { getElement } from '../src/plugin/utils/utils';

import { getViewConnector } from '../src/components/connector';
import { createSliderPlugin } from '../src/plugin/Plugin';

const sliderContainer = getElement('.slider');
const view = getViewConnector(sliderContainer);
const plugin = createSliderPlugin(view, {
  // numberOfHandlers: 4,
  startValues: 10,
  step: 0.1,
});

plugin.updateSliderOptions({ step: 10 });
