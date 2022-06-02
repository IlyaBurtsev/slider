import { Handler } from '../models/Handler';

export default class DataController {
  private handlerParametrs: HandlerParametrs;
  private sliderParametrs: SliderParametrs;
  private sliderOptions: SliderOptions;
  private stepsLength: number;

  constructor(sliderOptions: SliderOptions) {
    this.sliderOptions = sliderOptions;
  }

  public setSliderParametrs(parametrs: SliderParametrs): void {
    this.sliderParametrs = parametrs;
    this.setStepLength();
  }

  public getSliderLength(): number {
    return this.sliderParametrs.sliderLength;
  }

  public setHandlerParametrs(parametrs: HandlerParametrs): void {
    this.handlerParametrs = parametrs;
  }

  public initState = () => {
    const states: Array<State> = [];
    const { isDraggableRange, numberOfDraggableRanges, startValues, minValue, maxValue } = this.sliderOptions;
    const { handlerMinTranslate, handlerMaxTranslate } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;

    if (isDraggableRange) {
      let correctData: boolean = true;
      let chancelPreviousInit = true;
      let minCurrentValue = minValue;
      if (Array.isArray(startValues)) {
        if (startValues.length === numberOfDraggableRanges) {
          chancelPreviousInit = false;
          startValues.forEach((pair, pairIndex) => {
            if (Array.isArray(pair)) {
              if (pair.length === 2 && correctData) {
                pair.forEach((value, valueIndex) => {
                  if (value >= minCurrentValue && value <= maxValue) {
                    let state: State = {
                      position: this.convertValueToPosition(value, handlerMinTranslate),
                      minTranslate: 0,
                      maxTranslate: 0,
                    };
                    this.setLimits(
                      pairIndex,
                      valueIndex,
                      minCurrentValue,
                      handlerMinTranslate,
                      maxValue,
                      pair,
                      state,
                      startValues as Array<Array<number>>
                    );
                    states.push(state);
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
            states.splice(0);
            chancelPreviousInit = true;
          }
        }
        if (startValues.length === numberOfDraggableRanges * 2) {
          chancelPreviousInit = false;
          startValues.forEach((value, i) => {
            if (!Array.isArray(value)) {
              if (value >= minCurrentValue && value <= maxValue && correctData) {
                let state: State = {
                  position: this.convertValueToPosition(value, handlerMinTranslate),
                  minTranslate: 0,
                  maxTranslate: 0,
                };
                this.setLimits(0, i, minValue, handlerMinTranslate, maxValue, startValues as Array<number>, state);
                states.push(state);
                minCurrentValue = value;
              } else {
                correctData = false;
              }
            } else {
              correctData = false;
            }
          });
          if (!correctData) {
            states.splice(0);
            chancelPreviousInit = true;
          }
        }
        if (chancelPreviousInit) {
					
          for (let i = 0; i < numberOfDraggableRanges * 2; i++) {
						let minTranslate: number
						let position: number
						let state: State = {
							position: 0,
							minTranslate: handlerMinTranslate,
							maxTranslate: handlerMaxTranslate,
						};
						if((i-1) >=0) {
							minTranslate = states[i-1].position
							position = (i * sliderLength) / (numberOfDraggableRanges * 2 -1) + handlerMinTranslate;
							states[i-1].maxTranslate = position
						}else {
							position = handlerMinTranslate;
							minTranslate = handlerMinTranslate
						}
						if((i) < numberOfDraggableRanges*2) {
							state.maxTranslate = handlerMaxTranslate
						}
						state.minTranslate = minTranslate;
            state.position = position;
						states.push(state)
          }
        }
      }
    } else {
			let state: State = {
				position: 0,
				minTranslate: handlerMinTranslate,
				maxTranslate: handlerMaxTranslate,
			};
      if (!Array.isArray(startValues)) { 
        if (startValues >= minValue && startValues <= maxValue) {
          state.position = this.convertValueToPosition(startValues, handlerMinTranslate);
        } else {
					state.position = handlerMinTranslate;
				}				
      } else {
				state.position = handlerMinTranslate;
			}
			states.push(state);
    }
    return states;
  };

  private setLimits = (
    pairIndex: number,
    valueIndex: number,
    minCurrentValue: number,
    minTranslate: number,
    maxValue: number,
    pair: Array<number>,
    state: State,
    startValues?: Array<Array<number>>
  ) => {
    let minLimitValue: number;
    let maxLimitValue: number;
    if (valueIndex === 0) {
      minLimitValue = minCurrentValue;
      maxLimitValue = pair[1];
    } else {
      minLimitValue = pair[0];
      if (startValues !== undefined) {
        if ((pairIndex+1)<startValues.length) {
          maxLimitValue = startValues[pairIndex + 1][0];
        } else {
          maxLimitValue = maxValue;
        }
      } else {
        maxLimitValue = maxValue;
      }
    }

    state.minTranslate = this.convertValueToPosition(minLimitValue, minTranslate);
    state.maxTranslate = this.convertValueToPosition(maxLimitValue, minTranslate);
  };

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
        if (startValues.length === numberOfDraggableRanges * 2) {
          chancelPreviousInit = false;
          startValues.forEach((value, i) => {
            if (!Array.isArray(value)) {
              if (value >= minCurrentValue && value <= maxValue && correctData) {
                const handler = new Handler(i);
                handler.setPosition(this.convertValueToPosition(value, handlerMinTranslate));
                handlers.push(handler);
                minCurrentValue = value;
              } else {
                correctData = false;
              }
            } else {
              correctData = false;
            }
          });
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
          handlers.push(new Handler(0, this.convertValueToPosition(startValues, handlerMinTranslate)));
        } else {
          handlers.push(new Handler(0, handlerMinTranslate));
        }
      }
    }
    return [];
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
