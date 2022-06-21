import './example.scss';
import '../src/components/slider/slider';

import { getElement } from '../src/plugin/utils/utils';

import getViewConnector from '../src/components/connector';
import createSliderPlugin from '../src/plugin/Plugin';
import { RootState } from '../src/models/types';

const sliderContainer = getElement('.slider');
const view = getViewConnector(sliderContainer);
const plugin = createSliderPlugin(view, {
  numberOfHandlers: 4,
  startValues: [0, 31, 30, 60],
  step: 1,
  scaleStep: 10,
  toolTips: true,
  progressBar: true,
  scale: true,
});

plugin.updateSliderOptions({
  numberOfHandlers: 4,
  step: 10,
  startValues: 20,
  // toolTips: true,
  // progressBar: true,
  // scale: false,
  scaleStep: 2,
});
const startSubscriber = (id: number): void => {
  console.log(`start ${id}`);
};
const endSubscriber = (): void => {
  console.log('end');
};

const state = (state: RootState): void => {};
plugin.moveHandlerTo(0, 0);
plugin.moveHandlerTo(40, 1);

plugin.subscribeToGetStarted(startSubscriber);
plugin.subscribeToTheEndOfTheMovement(endSubscriber);
plugin.subscribeToChangeState(state);
