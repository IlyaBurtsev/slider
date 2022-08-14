import './example.scss';
import './style/style.scss';
import './style/fonts.scss';
import '../dist/index.css'
import initVerticalStarSlider from './components/vertical-star-slider/vertical-star-slider.ts';
import { initInput } from './components/input-field/input-field';
import pluginCreator from '../dist/Plugin.js';

const starSlider = document.querySelector('.js-vertical-sliders__star-slider');
const starSliderView = initVerticalStarSlider(starSlider);
starSliderView.scaleElements = pluginCreator.getScale(starSliderView.slider)

const starS = pluginCreator.createSliderPlugin(starSliderView, {
  numberOfHandlers: 2,
  progressBar: true,
  toolTips: true,
  scale: true,
});

const quickStart = document.querySelector('.js-vertical-sliders__simple-slider');
const quickStartView = pluginCreator.getViewConnector(quickStart);
const quickStartSlider = pluginCreator.createSliderPlugin(quickStartView, {
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
