import DataController from '../src/plugin/DataController';
import { correctOptions, resultWithCorrectOptions, resultWithIncorrectOptions, handlerParametrs, sliderParametrs, resultWithCorrectOptions2, resultWithCorrectOptionsOneRange } from './testData/DataForDataController';

describe('DataController', () => {

 

	test('Should return initial array of Handler with set position', () => {
		const	controller = new DataController(correctOptions);
		controller.setSliderParametrs(sliderParametrs);
		controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initHandlers()).toEqual(resultWithCorrectOptions);
  })

	test('Should return initial array of Handler with set position', () => {
		correctOptions.startValues = [[0, 20], [20, 40], [60, 120]]
		const	controller = new DataController(correctOptions);
		controller.setSliderParametrs(sliderParametrs);
		controller.setHandlerParametrs(handlerParametrs);
		
    expect(controller.initHandlers()).toEqual(resultWithCorrectOptions2);
  });

	test('Should return initial array of Handler with set position (one range)', () => {
		correctOptions.startValues = [0, 20];
		correctOptions.numberOfDraggableRanges = 1;
		const	controller = new DataController(correctOptions);
		controller.setSliderParametrs(sliderParametrs);
		controller.setHandlerParametrs(handlerParametrs);
		
    expect(controller.initHandlers()).toEqual(resultWithCorrectOptionsOneRange);
  });

	test('Should return initial array of Handler with default position', () => {
		correctOptions.startValues = [[-3, 30], [40, 50], [80, 100]]
		const	controller = new DataController(correctOptions);
		controller.setSliderParametrs(sliderParametrs);
		controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initHandlers()).toEqual(resultWithIncorrectOptions);
  });

	test('Should return initial array of Handler with default position', () => {
		correctOptions.startValues = [[10, 30], [40, 81], [80, 100]]
		const	controller = new DataController(correctOptions);
		controller.setSliderParametrs(sliderParametrs);
		controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initHandlers()).toEqual(resultWithIncorrectOptions);
  });

	test('Should return initial array of Handler with default position', () => {
		correctOptions.startValues = [[10, 30], [40, 60], [80, 70]]
		const	controller = new DataController(correctOptions);
		controller.setSliderParametrs(sliderParametrs);
		controller.setHandlerParametrs(handlerParametrs);
    expect(controller.initHandlers()).toEqual(resultWithIncorrectOptions);
  });
});
