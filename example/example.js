import './example.scss';
import '../src/components/slider/slider.ts';
import './style/style.scss';
import './style/fonts.scss';
import initVerticalStarSlider from './components/vertical-star-slider/vertical-star-slider.ts';
import { initInput } from './components/input-field/input-field';
import plugin from '../dist/Plugin.js';

const starSlider = document.querySelector('.js-vertical-sliders__star-slider');
const starSliderView = initVerticalStarSlider(starSlider);
console.log(plugin);

const starS = plugin.createSliderPlugin(starSliderView, {
  numberOfHandlers: 2,
  progressBar: true,
  toolTips: true,
  scale: true,
});

const quickStart = document.querySelector('.js-vertical-sliders__simple-slider');
const quickStartView = plugin.getViewConnector(quickStart);
const quickStartSlider = plugin.createSliderPlugin(quickStartView, {
  numberOfHandlers: 2,
  progressBar: true,
  toolTips: true,
  scale: true,
});

const firstInputComponent = initInput(quickStart.nextElementSibling);
const secondInputComponent = initInput(quickStart.nextElementSibling?.lastElementChild);

const onChangeFirstInput = () => {
  quickStartSlider.moveHandlerTo(Number(firstInputComponent.getValue()), 0);
};
const onChangeSecondInput = () => {
  quickStartSlider.moveHandlerTo(Number(secondInputComponent.getValue()), 1);
};
firstInputComponent.getInput().onchange = onChangeFirstInput;
secondInputComponent.getInput().onchange = onChangeSecondInput;

const onChangeSliderState = (state) => {
  const [firstValue, secondValue] = state.valuesState.values;
  firstInputComponent.setValue(firstValue);
  secondInputComponent.setValue(secondValue);
};

quickStartSlider.subscribeToChangeState(onChangeSliderState);
