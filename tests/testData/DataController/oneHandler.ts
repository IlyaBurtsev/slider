import { Orientation } from '../../../src/models/Orientation';

const correctOptions: SliderOptions = {
  isDraggableRange: false,
  numberOfDraggableRanges: 1,
  orientation: Orientation.Horizontal,
  minValue: 0,
  maxValue: 100,
  step: 1,
  startValues: 0,
};

const handlerParametrs: HandlerParametrs = {
  startHandlerLength: 20,
  endHandlerLength: null,
  handlerMinTranslate: -10,
  handlerMaxTranslate: 990,
};

const sliderParametrs: SliderParametrs = {
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

const resultState = (position: number): HandlerState => {
  const state: HandlerState = {
    position: -10,
    minTranslate: -10,
    maxTranslate: 990,
  };
  state.position = position;
  return state;
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
