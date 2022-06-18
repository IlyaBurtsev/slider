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
	resultRangeState,
	resultInitState
} from './testData/DataController/oneMoreHandler';

describe('DataController', () => {
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

  test('Should return initial state with set position (four handlers).', () => {
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeState(['0', '30', '33', '60']));
  });

	test('Should return initial state with default position (four handlers).', () => {
		correctOptionsDraggableRange.startValues = [0, 31, 30, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitState);
  });

	test('Should return initial state with default position (four handlers).', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 30, 101];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitState);
  });

	test('Should return initial state with default position (four handlers).', () => {
		correctOptionsDraggableRange.startValues = [103, 30, 50, 100];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitState);
  });

	test('Should return initial state with default position (four handlers).', () => {
		correctOptionsDraggableRange.startValues = [-1, 30, 50, 100];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitState);
  });

  test('Should return initial state with set position (four handlers, two handlers side by side).', () => {
    correctOptionsDraggableRange.startValues = [0, 30, 30, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeState(['0', '30', '30', '60'], 320, 2));
  });

  test('Should return initial state with set position (four handlers, two handlers side by side).', () => {
    correctOptionsDraggableRange.startValues = [0, 30, 31, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeState(['0', '30', '30', '60'], 320, 2));
  });

  test('Should return initial state with set position (four handlers, two handlers side by side, limit position).', () => {
    correctOptionsDraggableRange.startValues = [0, 30, 32, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultRangeState(['0', '30', '32', '60'], 320, 2));
  });

	test('Should return correct state when change position (move handler forward)', () => {
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
      newRootState = controller.changeState(ChangeStateTypes.handlerMovement, newRootState, userPosition, 0);
      expect(newRootState).toEqual(resultState(handlerPosition, value));
    }
  });

  test('Should return correct state when change position (move handler backward)', () => {
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
      newRootState = controller.changeState(ChangeStateTypes.handlerMovement, newRootState, userPosition, 0 );
      expect(newRootState).toEqual(resultState(handlerPosition, value));
    }
  });

  test('Should return correct state when change position (tap on slider )', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.tapOnSlider, oldState, 850, -1);
    expect(newState).toEqual(resultRangeState(['0', '30', '45', '60'], 450, 2));
  });

	test('Should return correct state when change position (tap on slider )', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.tapOnSlider, oldState, 855, -1);
    expect(newState).toEqual(resultRangeState(['0', '30', '45', '60'], 450, 2));
  });

	test('Should return correct state when change position (tap on slider )', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.tapOnSlider, oldState, 856, -1);
    expect(newState).toEqual(resultRangeState(['0', '30', '33', '46'], 460, 3));
  });

	test('Should return correct state when change position (tap on slider )', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.tapOnSlider, oldState, 860, -1);
    expect(newState).toEqual(resultRangeState(['0', '30', '33', '46'], 460, 3));
  });

	test('Should return correct state when change value (with API method)', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.externalChangeValue, oldState, 20, 0);
    expect(newState).toEqual(resultRangeState(['20', '30', '33', '60'], 200, 0));
  });

	test('Should return correct state when change value above limit (with API method)', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.externalChangeValue, oldState, 61, 2);
    expect(newState).toEqual(resultRangeState(['0', '30', '60', '60'], 580, 2));
  });

	test('Should return correct state when change value below limit (with API method)', () => {
		correctOptionsDraggableRange.startValues = [0, 30, 33, 60];
    const controller = new DataController(trigger, correctOptionsDraggableRange);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    const oldState = resultRangeState(['0', '30', '33', '60'])
		const newState = controller.changeState(ChangeStateTypes.externalChangeValue, oldState, -1, 1);
    expect(newState).toEqual(resultRangeState(['0', '0', '33', '60'], 20, 1));
  });
});
