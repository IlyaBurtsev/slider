import DataController from '../src/plugin/DataController';
import {
  correctOptions,
  defaultInitialStates,
  defaultState,
  handlerParametrs,
  resultInitialStates,
  resultState,
  sliderParametrs,
} from './testData/DataController/oneHandler';

describe('DataController one handler', () => {
  test('Should return initial state with set position', () => {
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitialStates(-10));
  });

  test('Should return initial state with set position', () => {
    correctOptions.startValues = 100;
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitialStates(990));
  });

  test('Should return initial state with set position', () => {
    correctOptions.startValues = 50;
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(resultInitialStates(490));
  });

  test('Should return initial state with default position', () => {
    correctOptions.startValues = -1;
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(defaultInitialStates);
  });

  test('Should return initial state with default position', () => {
    correctOptions.startValues = 200;
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(defaultInitialStates);
  });

  test('Should return initial state with default position', () => {
    correctOptions.startValues = [30, 40];
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initState()).toEqual(defaultInitialStates);
  });

  test('Should return correct state when change position (move forward)', () => {
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    let newState: State = defaultState;
		let handlerPosition: number = -10;
    for (let userPosition = 0; userPosition < 2000; userPosition++) {
      let relatePosition: number = 0;
      const step =
        (sliderParametrs.sliderLength / (correctOptions.maxValue - correctOptions.minValue)) * correctOptions.step;
      if (userPosition >= 400 && userPosition <= 1400) {
        relatePosition = userPosition - 400;
        if (relatePosition % step === 0) {
          handlerPosition = relatePosition -10;
        }
      }
      if (userPosition >= 1400) {
        handlerPosition = 990;
      }
      expect(controller.changeState(newState, userPosition, 0)).toEqual(resultState(handlerPosition));
      newState = controller.changeState(newState, userPosition, 0);
			
    }
  });

	test('Should return correct state when change position (move backward)', () => {
    const controller = new DataController(correctOptions);
    controller.setSliderParametrs(sliderParametrs);
    controller.setHandlerParametrs(handlerParametrs);
    let newState: State = defaultState;
		let handlerPosition: number = -10;
    for (let userPosition = 2000; userPosition > 0; userPosition--) {
      let relatePosition: number = 0;
      const step =
        (sliderParametrs.sliderLength / (correctOptions.maxValue - correctOptions.minValue)) * correctOptions.step;
      if (userPosition >= 400 && userPosition <= 1400) {
        relatePosition = userPosition - 400;
        if (relatePosition % step === 0) {
          handlerPosition = relatePosition -10;
        }
      }
      if (userPosition >= 1400) {
        handlerPosition = 990;
      }
      expect(controller.changeState(newState, userPosition, 0)).toEqual(resultState(handlerPosition));
      newState = controller.changeState(newState, userPosition, 0);
			
    }
  });
});
