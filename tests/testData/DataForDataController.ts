import { Handler } from '../../src/models/Handler';
import { Orientation } from '../../src/models/Orientation';

const correctOptions: SliderOptions = {
  isDraggableRange: true,
  numberOfDraggableRanges: 3,
  orientation: Orientation.Horizontal,
  minValue: 0,
  maxValue: 120,
  step: 1,
  startValues: [
    [10, 20],
    [20, 40],
    [60, 100],
  ],
};

const handlerParametrs: HandlerParametrs = {
  startHandlerLength: 10,
  endHandlerLength: null,
  handlerMinTranslate: -200,
  handlerMaxTranslate: 1400,
};

const sliderParametrs: SliderParametrs = {
  sliderLength: 1200,
  sliderStartPosition: 400,
  sliderEndPosition: 1600,
};

const resultWithCorrectOptions: Array<Handler> = [
  new Handler(0, -100),
  new Handler(1, 0),
  new Handler(2, 0),
  new Handler(3, 200),
  new Handler(4, 400),
  new Handler(5, 800),
];

const resultWithCorrectOptions2: Array<Handler> = [
  new Handler(0, -200),
  new Handler(1, 0),
  new Handler(2, 0),
  new Handler(3, 200),
  new Handler(4, 400),
  new Handler(5, 1000),
];

const resultWithCorrectOptionsOneRange: Array<Handler> = [new Handler(0, -200), new Handler(1, 0)];

const resultWithCorrectOptionsOneHandler: Array<Handler> = [new Handler(0, 0)];

const resultWithIncorrectOptionsOneHandler: Array<Handler> = [new Handler(0, -200)];


const resultWithIncorrectOptions: Array<Handler> = [
  new Handler(0, -200),
  new Handler(1, 200),
  new Handler(2, 400),
  new Handler(3, 600),
  new Handler(4, 800),
  new Handler(5, 1000),
];


export {
  correctOptions,
  resultWithCorrectOptions,
  resultWithCorrectOptions2,
	resultWithCorrectOptionsOneRange,
	resultWithCorrectOptionsOneHandler,
	resultWithIncorrectOptionsOneHandler,
  resultWithIncorrectOptions,
  handlerParametrs,
  sliderParametrs,
};
