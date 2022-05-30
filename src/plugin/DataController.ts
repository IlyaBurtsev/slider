import { Handler } from '../models/Handler';

export default class DataController {
  private handlerParametrs: HandlerParametrs;
  private sliderParametrs: SliderParametrs;
  private sliderOptions: SliderOptions;
  private stepsLength: number;

  constructor(sliderOptions: SliderOptions) {
    this.sliderOptions = sliderOptions;
  }

  public setHandlerParametrs(parametrs: HandlerParametrs): void {
    this.handlerParametrs = parametrs;
  }

  public setSliderParametrs(parametrs: SliderParametrs): void {
    this.sliderParametrs = parametrs;
    this.setStepLength();
  }

  public initHandlers = (): Array<Handler> => {
    const handlers: Array<Handler> = [];
    const { isDraggableRange, numberOfDraggableRanges, startValues, minValue, maxValue } = this.sliderOptions;
    const { handlerMinTranslate } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;
    if (isDraggableRange) {
      let correctData: boolean = true;
      let chancelPreviousInit = true;
      let minCurrentValue = minValue;
      if (Array.isArray(startValues)) {
        if (startValues.length === numberOfDraggableRanges) {
          chancelPreviousInit = false;
          startValues.forEach((pair) => {
            if (Array.isArray(pair)) {
              if (pair.length === 2 && correctData) {
                pair.forEach((value) => {
                  if (value >= minCurrentValue && value <= maxValue) {
                    const handler = new Handler();
                    handler.setPosition(this.convertValueToPosition(value, handlerMinTranslate));
                    handlers.push(handler);
                    minCurrentValue = value;
                  } else {
                    correctData = false;
                  }
                });
              } else {
                correctData = false;
              }
            } 
          });
          if (!correctData) {
            handlers.splice(0);
            chancelPreviousInit = true;
          } else {
            handlers.forEach((handler, id) => handler.setId(id));
          }
        }
				if (startValues.length === 2) {
					startValues.forEach((value, i) => {
						if(!Array.isArray(value)){
							if ((value )>= minCurrentValue && value <= maxValue && correctData) {
								const handler = new Handler(i);
								handler.setPosition(this.convertValueToPosition(value, handlerMinTranslate));
								handlers.push(handler);
								minCurrentValue = value;
							} else {
								correctData = false;
							}
						}else {
							correctData = false;
						}
					})
					if (!correctData) {
            handlers.splice(0);
            chancelPreviousInit = true;
          }
				}
        if (chancelPreviousInit) {
          for (let i = 0; i < numberOfDraggableRanges * 2; i++) {
            let position = (i * sliderLength) / (numberOfDraggableRanges * 2);
            if (position === 0) {
              position = handlerMinTranslate;
            }
            handlers.push(new Handler(i, position));
          }
        }
      }
    } else {
      if (!Array.isArray(startValues)) {
        if (startValues >= minValue && startValues <= maxValue) {
          handlers.push(new Handler(0, startValues));
        }
      }
    }
    return handlers;
  };

  public getHandlerPosition = (newUserposition: number, handler: Handler): number | false => {
    const { sliderStartPosition, sliderEndPosition } = this.sliderParametrs;
    const { handlerMinTranslate, handlerMaxTranslate } = this.handlerParametrs;

    const { isDraggableRange } = this.sliderOptions;
    const calcUserPosition = newUserposition - sliderStartPosition;

    if (isNaN(calcUserPosition)) {
      return false;
    }
    if (newUserposition <= sliderStartPosition) {
      return handlerMinTranslate;
    }
    if (newUserposition > sliderEndPosition) {
      return handlerMaxTranslate;
    }

    if (isDraggableRange) {
    }
    let step: number = 0;

    if (handler.getPosition() <= calcUserPosition + handlerMinTranslate) {
      step = Math.floor(Math.abs(calcUserPosition) / this.stepsLength);
    } else {
      step = Math.ceil(Math.abs(calcUserPosition) / this.stepsLength);
    }
    if (step === 0) {
      return handlerMinTranslate;
    }

    if (calcUserPosition < 0) {
      return -(step * this.stepsLength + handlerMinTranslate);
    } else {
      return step * this.stepsLength + handlerMinTranslate;
    }
  };

  private setStepLength = (): void => {
    const { sliderLength } = this.sliderParametrs;
    const { step, minValue, maxValue } = this.sliderOptions;
    this.stepsLength = Number(((sliderLength / (maxValue - minValue)) * step).toFixed(5));
  };

  private convertValueToPosition = (value: number, minTranslate: number): number => {
    const { sliderLength } = this.sliderParametrs;
    const { minValue, maxValue } = this.sliderOptions;
    return (sliderLength / (maxValue - minValue)) * value + minTranslate;
  };
}
