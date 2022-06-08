export default class DataController {
  private handlerParametrs: HandlerParametrs;
  private sliderParametrs: SliderParametrs;
  private sliderOptions: SliderOptions;
  private stepsLength: number;

  constructor(sliderOptions: SliderOptions) {
    this.sliderOptions = sliderOptions;
  }

  public setSliderParametrs = (parametrs: SliderParametrs): void => {
    this.sliderParametrs = parametrs;
    this.setStepLength();
  };

  public getSliderLength = (): number => {
    return this.sliderParametrs.sliderLength;
  };

  public setHandlerParametrs = (parametrs: HandlerParametrs): void => {
    this.handlerParametrs = parametrs;
  };

  public initState = (): Array<State> => {
    const states: Array<State> = [];
    const { isDraggableRange, numberOfDraggableRanges, startValues, minValue, maxValue } = this.sliderOptions;
    const { handlerMinTranslate, handlerMaxTranslate, startHandlerLength } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;
    const minValueRange = this.getMinValuesRange();

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
                  setStatePosition(value, minCurrentValue, correctData, this);
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
          startValues.forEach((value) => {
            if (!Array.isArray(value)) {
              if (correctData) {
                setStatePosition(value, minCurrentValue, correctData, this);
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
            let position: number;
            let state: State = {
              position: 0,
              minTranslate: 0,
              maxTranslate: 0,
            };
            if (i !== 0) {
              position = (i * sliderLength) / (numberOfDraggableRanges * 2 - 1) + handlerMinTranslate;
            } else {
              position = handlerMinTranslate;
            }
            state.position = position;
            states.push(state);
          }
        }
      }
      this.updateLimits(states);
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
    console.log(states);
    return states;

    function setStatePosition(
      value: number,
      minCurrentValue: number,
      correctData: boolean,
      that: DataController
    ): void {
      let state: State = {
        position: 0,
        minTranslate: 0,
        maxTranslate: 0,
      };
      if (value > minCurrentValue && value <= maxValue) {
        state.position = that.convertValueToPosition(value, handlerMinTranslate);
        states.push(state);
        minCurrentValue = value + minValueRange;
      } else {
        if (value >= minCurrentValue - minValueRange) {
          state.position = that.convertValueToPosition(value, handlerMinTranslate) + startHandlerLength + 1;
        } else {
          correctData = false;
        }
      }
    }
  };

  public changeState = (state: State, newUserposition: number, handlerId: number): State => {
    if (handlerId === -1) {
      return state;
    }

    const { sliderStartPosition } = this.sliderParametrs;
    const { handlerMinTranslate } = this.handlerParametrs;

    const calcUserPosition = newUserposition - sliderStartPosition;

    if (isNaN(calcUserPosition)) {
      return state;
    }

    if (calcUserPosition + handlerMinTranslate <= state.minTranslate) {
      state.position = state.minTranslate;
      return state;
    }
    if (calcUserPosition + handlerMinTranslate >= state.maxTranslate) {
      state.position = state.maxTranslate;
      return state;
    }

    let step: number = 0;
    if (state.position <= calcUserPosition + handlerMinTranslate) {
      step = Math.floor(Math.abs(calcUserPosition) / this.stepsLength);
    } else {
      step = Math.ceil(Math.abs(calcUserPosition) / this.stepsLength);
    }
    if (step === 0) {
      return state;
    }
    if (calcUserPosition < 0) {
      state.position = -(step * this.stepsLength + handlerMinTranslate);
      return state;
    } else {
      state.position = step * this.stepsLength + handlerMinTranslate;
      return state;
    }
  };

  public updateLimits = (states: Array<State>): Array<State> => {
    const { handlerMinTranslate, handlerMaxTranslate, startHandlerLength, endHandlerLength } = this.handlerParametrs;
    // TODO add limits if end and start HandlerLengths are different
    states.forEach((state, index) => {
      if (index - 1 >= 0) {
        state.minTranslate = states[index - 1].position + startHandlerLength;
        states[index - 1].maxTranslate = state.position - startHandlerLength;
      } else {
        state.minTranslate = handlerMinTranslate;
      }
      if (index === states.length - 1) {
        state.maxTranslate = handlerMaxTranslate;
      }
    });
    return states;
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

  public convertPositionToValue = (position: number): string => {
    const { handlerMinTranslate } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;
    const { minValue, maxValue, step } = this.sliderOptions;
    let count = this.getCount(step);
    return (((maxValue - minValue) / sliderLength) * (position - handlerMinTranslate)).toFixed(count);
  };

  private getMinValuesRange = (): number => {
    const { minValue, maxValue, step } = this.sliderOptions;
    const { startHandlerLength, endHandlerLength } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;
    // TODO add range if end and start HandlerLengths are different
    return ((maxValue - minValue) * startHandlerLength) / sliderLength;
  };

  private getCount(step: number): number | undefined {
    if (step.toString().includes('.')) {
      return step.toString().split('.').pop()?.length;
    } else {
      return 0;
    }
  }
}
