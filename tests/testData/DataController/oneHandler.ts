import SliderOptions from '../../../src/models/interfaces/SliderOptions';
import Orientation from '../../../src/models/Orientation';
import HandlerParametrs from '../../../src/models/types/HandlerParametrs';
import HandlerState from '../../../src/models/types/HandlerState';
import RootState from '../../../src/models/types/RootState';
import SliderParametrs from '../../../src/models/types/SliderParametrs';

const correctOptions: SliderOptions = {
  numberOfHandlers: 1,
  orientation: Orientation.Horizontal,
  minValue: 0,
  maxValue: 100,
  step: 1,
  startValues: 0,
  toolTips: false,
  progressBar: false,
  scale: false,
  scaleStep: 10,
};

const handlerParametrs: HandlerParametrs = {
  handlerLength: 20,
  handlerMinTranslate: -10,
  handlerMaxTranslate: 990,
  handlerTop: -10,
  handlerBottom: 40,
};

const sliderParametrs: SliderParametrs = {
  orientation: Orientation.Horizontal,
  sliderLength: 1000,
  sliderStartPosition: 400,
  sliderEndPosition: 1400,
};

const defaultInitialState: HandlerState = {
  position: -10,
  minTranslate: -10,
  maxTranslate: 990,
};

const defaultInitialStates = [defaultInitialState];

const resultInitialStates = (position: number): Array<HandlerState> => {
  const newState: HandlerState = {
    position: -10,
    minTranslate: -10,
    maxTranslate: 990,
  };
  newState.position = position;
  return [newState];
};

const defaultState: HandlerState = {
  position: -10,
  minTranslate: -10,
  maxTranslate: 990,
};

const resultState = (position: number, value: number): RootState => {
  const state: HandlerState = {
    position: -10,
    minTranslate: -10,
    maxTranslate: 990,
  };
  const values = [`${value}`];
  state.position = position;
  return {
    handlerStates: [state],
    valuesState: { values },
  };
};

export {
  correctOptions,
  handlerParametrs,
  sliderParametrs,
  defaultInitialStates,
  resultInitialStates,
  defaultState,
  resultState,
};
