import { Orientation } from '../../../src/models/Orientation';

const correctOptionsDraggableRange: UserOptions = {
  numberOfHandlers: 4,
  orientation: Orientation.Horizontal,
  minValue: 0,
  maxValue: 100,
  step: 1,
  startValues: [0, 30, 33, 60],
};

const state0 = {
  position: -10,
  minTranslate: -10,
  maxTranslate: 270,
};

const state1 = {
  position: 290,
  minTranslate: 10,
  maxTranslate: 300,
};

const state2 = {
  position: 320,
  minTranslate: 310,
  maxTranslate: 570,
};

const state3 = {
  position: 590,
  minTranslate: 340,
  maxTranslate: 990,
};

const state1SideBySide = {
  position: 290,
  minTranslate: 10,
  maxTranslate: 290,
};

const state2SideBySide = {
  position: 310,
  minTranslate: 310,
  maxTranslate: 570,
};
const state3SideBySide = {
  position: 590,
  minTranslate: 330,
  maxTranslate: 990,
};
const handlerStates = [state0, state1, state2, state3];
const valuesState: ValuesState = { values: ['0', '30', '33', '60'] };

const handlerStatesSideBySide = [state0, state1SideBySide, state2SideBySide, state3SideBySide];
const valuesStateSideBySide: ValuesState = { values: ['0', '30', '30', '60'] };
const valuesStateSideBySideLimit: ValuesState = { values: ['0', '30', '32', '60'] };

const resultStateDraggableRange = { handlerStates: handlerStates, valuesState: valuesState };
const resultRangeSideBySide = { handlerStates: handlerStatesSideBySide, valuesState: valuesStateSideBySide };
const resultRangeSideBySideLimitPosition = {
  handlerStates: handlerStatesSideBySide,
  valuesState: valuesStateSideBySideLimit,
};

export {
  correctOptionsDraggableRange,
  resultStateDraggableRange,
  resultRangeSideBySide,
  resultRangeSideBySideLimitPosition,
};
