import UserOptions from '../../../src/models/interfaces/UserOptions';
import Orientation from '../../../src/models/Orientation';
import RootState from '../../../src/models/types/RootState';

const correctOptionsDraggableRange: UserOptions = {
  numberOfHandlers: 4,
  orientation: Orientation.Horizontal,
  minValue: 0,
  maxValue: 100,
  step: 1,
  startValues: [0, 30, 33, 60],
};

const state0Default = {
  position: -10,
  minTranslate: -10,
  maxTranslate: 300,
};
const state1Default = {
  position: 320,
  minTranslate: 10,
  maxTranslate: 630,
};

const state2Default = {
  position: 650,
  minTranslate: 340,
  maxTranslate: 970,
};

const state3Default = {
  position: 990,
  minTranslate: 670,
  maxTranslate: 990,
};

const resultInitState: RootState = {
  handlerStates: [state0Default, state1Default, state2Default, state3Default],
  valuesState: { values: ['0', '33', '66', '100'] },
};

const resultRangeState = (values: Array<string>, position?: number, id?: number): RootState => {
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

  const handlerStates = [state0, state1, state2, state3];

  if (position !== undefined && id !== undefined) {
    position -= 10;
    handlerStates[id].position = position;
    if (id > 0) {
      handlerStates[id - 1].maxTranslate = position - 20;
    }
    if (id < 3) {
      handlerStates[id + 1].minTranslate = position + 20;
    }
  }
  return { handlerStates, valuesState: { values } };
};

export { correctOptionsDraggableRange, resultRangeState, resultInitState };
