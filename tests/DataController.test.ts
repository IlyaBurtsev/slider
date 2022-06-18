import { ChangeStateTypes } from '../src/models/ChangeStateTypes';
import DataController from '../src/plugin/data-controller/DataController';
import {
  correctOptions,
  defaultInitialStates,
  defaultState,
  handlerParametrs,
  resultInitialStates,
  resultState,
  sliderParametrs,
} from './testData/DataController/oneHandler';

import {
  correctOptionsDraggableRange,
  resultRangeSideBySide,
  resultRangeSideBySideLimitPosition,
  resultStateDraggableRange,
} from './testData/DataController/oneMoreHandler';

describe('DataController one handler', () => {
  const trigger = () => {};
  test('Should return initial state with set position', () => {
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState().handlerStates).toEqual(resultInitialStates(-10));
  });

  test('Should return initial state with set position', () => {
    correctOptions.startValues = 100;
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState().handlerStates).toEqual(resultInitialStates(990));
  });

  test('Should return initial state with set position', () => {
    correctOptions.startValues = 50;
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState().handlerStates).toEqual(resultInitialStates(490));
  });

  test('Should return initial state with default position', () => {
    correctOptions.startValues = -1;
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState().handlerStates).toEqual(defaultInitialStates);
  });

  test('Should return initial state with default position', () => {
    correctOptions.startValues = 200;
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState().handlerStates).toEqual(defaultInitialStates);
  });

  test('Should return initial state with default position', () => {
    correctOptions.startValues = [30, 40];
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState().handlerStates).toEqual(defaultInitialStates);
  });

  test('Should return correct state when change position (move forward)', () => {
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    let newState: HandlerState = defaultState;
    let valuesState: ValuesState = { values: [] };
    let newRootState: RootState = { handlerStates: [newState], valuesState: valuesState };
    let handlerPosition: number = -10;
    let value: number = 0;
    for (let userPosition = 0; userPosition < 2000; userPosition++) {
      let relatePosition: number = 0;

      const step =
        (sliderParametrs.sliderLength / (correctOptions.maxValue - correctOptions.minValue)) * correctOptions.step;
      if (userPosition > 400 && userPosition <= 1400) {
        relatePosition = userPosition - 400;
        if (relatePosition % step === 0) {
          handlerPosition = relatePosition - 10;
          value++;
        }
      }
      if (userPosition >= 1400) {
        handlerPosition = 990;
        value = 100;
      }
      newRootState = controller.changeState(newRootState, userPosition, 0, ChangeStateTypes.handlerMovement);
      expect(newRootState).toEqual(resultState(handlerPosition, value));
    }
  });

  test('Should return correct state when change position (move backward)', () => {
    const controller = new DataController(trigger, correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    let newState: HandlerState = defaultState;
    let valuesState: ValuesState = { values: [] };
    let newRootState: RootState = { handlerStates: [newState], valuesState: valuesState };
    let handlerPosition: number = -10;
    let value: number = 100;
    for (let userPosition = 2000; userPosition > 0; userPosition--) {
      let relatePosition: number = 0;
      const step =
        (sliderParametrs.sliderLength / (correctOptions.maxValue - correctOptions.minValue)) * correctOptions.step;
      if (userPosition >= 400 && userPosition <= 1400) {
        relatePosition = userPosition - 400;
        if (relatePosition % step === 0) {
          handlerPosition = relatePosition - 10;
          value--;
        }
      }
      if (userPosition >= 1400) {
        handlerPosition = 990;
        value = 100;
      }
      newRootState = controller.changeState(newRootState, userPosition, 0, ChangeStateTypes.handlerMovement);
      expect(newRootState).toEqual(resultState(handlerPosition, value));
    }
  });

  test('Should return initial state with set position (four handlers).', () => {
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultStateDraggableRange);
  });

  test('Should return initial state with set position (four handlers, two handlers side by side).', () => {
    correctOptionsDraggableRange.startValues = [0, 30, 30, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeSideBySide);
  });

  test('Should return initial state with set position (four handlers, two handlers side by side).', () => {
    correctOptionsDraggableRange.startValues = [0, 30, 31, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeSideBySide);
  });

  test('Should return initial state with set position (four handlers, two handlers side by side).', () => {
    correctOptionsDraggableRange.startValues = [0, 30, 32, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeSideBySideLimitPosition);
  });
});
