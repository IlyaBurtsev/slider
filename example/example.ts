import './example.scss';
import '../src/components/slider/slider';

import { getElement } from '../src/plugin/utils/utils';

import { getViewConnector } from '../src/components/connector';
import { createSliderPlugin } from '../src/plugin/Plugin';

const sliderContainer = getElement('.slider');
const view = getViewConnector(sliderContainer);
const plugin = createSliderPlugin(view, {
  numberOfHandlers: 1,
  startValues: 10,
  step: 1,
});

plugin.updateSliderOptions({ 
	numberOfHandlers: 3,
	step:1,
	startValues: 20
	});
const startSubscriber = (id: number): void => {
	console.log('start '+id)
}
const endSubscriber = (): void => {
	console.log('end')
}

const state =(state: RootState):void => {

}
plugin.moveHandlerTo(0, 0)
plugin.moveHandlerTo(40, 1)

plugin.subscribeToGetStarted(startSubscriber)
plugin.subscribeToTheEndOfTheMovement(endSubscriber)
plugin.subscribeToChangeState(state)


