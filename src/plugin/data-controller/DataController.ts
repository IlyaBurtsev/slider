export default class DataController {
  private handlerParametrs: HandlerParametrs;
  private sliderOptions: SliderOptions;
  private sliderParametrs: SliderParametrs;

  constructor(sliderOptions: SliderOptions) {
    this.sliderOptions = sliderOptions;
  }

  public getSliderLength = (): number => {
    const { sliderLength } = this.sliderParametrs;
    return sliderLength;
  };

  public setSliderParametrs = (parametrs: SliderParametrs): void => {
    this.sliderParametrs = parametrs;
  };

  public getHandlerLength = (): number => {
    return this.handlerParametrs.startHandlerLength;
  };

  public setHandlerParametrs = (parametrs: HandlerParametrs): void => {
    this.handlerParametrs = parametrs;
  };

  public initState = (): RootState => {
    const handlerStates: Array<HandlerState> = [];
    const valuesState: ValuesState = {
      values: [],
    };
    const { values } = valuesState;
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
          startValues.forEach((pair, pairIndex) => {
            if (Array.isArray(pair)) {
              if (pair.length === 2 && correctData) {
                pair.forEach((value, index) => {
                  let result = setStatePosition(value, index, minCurrentValue, this, pairIndex);
                  if (typeof result === 'number') {
                    minCurrentValue = result;
                  } else {
                    correctData = result;
                  }
                });
              } else {
                correctData = false;
              }
            }
          });
          if (!correctData) {
            handlerStates.splice(0);
            chancelPreviousInit = true;
          }
        }
        if (startValues.length === numberOfDraggableRanges * 2) {
          chancelPreviousInit = false;
          startValues.forEach((value, index) => {
            if (!Array.isArray(value)) {
              if (correctData) {
                let result = setStatePosition(value, index, minCurrentValue, this);
                if (typeof result === 'number') {
                  minCurrentValue = result;
                } else {
                  correctData = result;
                }
              }
            } else {
              correctData = false;
            }
          });
          if (!correctData) {
            handlerStates.splice(0);
            chancelPreviousInit = true;
          }
        }
        if (chancelPreviousInit) {
          for (let i = 0; i < numberOfDraggableRanges * 2; i++) {
            let position: number;
            let state: HandlerState = {
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
            handlerStates.push(state);
          }
        }
      }
      this.updateLimits(handlerStates);
    } else {
      let state: HandlerState = {
        position: 0,
        minTranslate: handlerMinTranslate,
        maxTranslate: handlerMaxTranslate,
      };
      if (!Array.isArray(startValues)) {
        if (startValues >= minValue && startValues <= maxValue) {
          state.position = this.convertValueToPosition(startValues, handlerMinTranslate);
          values.push(`${startValues}`);
        } else {
          state.position = handlerMinTranslate;
          values.push(`${minValue}`);
        }
      } else {
        state.position = handlerMinTranslate;
        values.push(`${minValue}`);
      }
      handlerStates.push(state);
    }
    return {
      handlerStates: handlerStates,
      valuesState: valuesState,
    };

    function setStatePosition(
      value: number,
      index: number,
      minCurrentValue: number,
      that: DataController,
      pairIndex?: number
    ): number | boolean {
      let state: HandlerState = {
        position: 0,
        minTranslate: 0,
        maxTranslate: 0,
      };
      if (value > maxValue) {
        return false;
      }
      if (value >= minCurrentValue) {
        state.position = that.convertValueToPosition(value, handlerMinTranslate);
        handlerStates.push(state);
        values.push(`${value}`);
        return value + minValueRange;
      }
      if (pairIndex === 0 && index === 0) {
        return false;
      }
      if (value >= minCurrentValue - minValueRange) {
        state.position = that.convertValueToPosition(minCurrentValue, handlerMinTranslate);
        handlerStates.push(state);
        values.push(`${value}`);
        return value + minValueRange;
      }
      return false;
    }
  };

  public changeState = (state: RootState, newUserposition: number, id: number): RootState => {
    const { minValue, maxValue } = this.sliderOptions;
    const sliderParametrs = this.sliderParametrs;
    const { sliderStartPosition, sliderLength } = sliderParametrs;
    const stepsLength = this.getStepLength(sliderLength);
    if (id === -1) {
      return state;
    }

    const { handlerMinTranslate } = this.handlerParametrs;

    const handlerState = state.handlerStates[id];
    const values = state.valuesState.values;

    const calcUserPosition = newUserposition - sliderStartPosition;

    if (isNaN(calcUserPosition)) {
      return state;
    }

    if (calcUserPosition + handlerMinTranslate <= handlerState.minTranslate) {
      handlerState.position = handlerState.minTranslate;
      if (id > 0) {
        values[id] = values[id - 1];
      } else {
        values[id] = `${minValue}`;
      }
      return state;
    }
    if (calcUserPosition + handlerMinTranslate >= handlerState.maxTranslate) {
      handlerState.position = handlerState.maxTranslate;
      if (id < values.length - 1) {
        values[id] = values[id + 1];
      } else {
        values[id] = `${maxValue}`;
      }
      return state;
    }

    let step: number = 0;
    if (handlerState.position <= calcUserPosition + handlerMinTranslate) {
      step = Math.floor(Math.abs(calcUserPosition) / stepsLength);
    } else {
      step = Math.ceil(Math.abs(calcUserPosition) / stepsLength);
    }
    if (step === 0) {
      return state;
    }
    let position: number;
    if (calcUserPosition < 0) {
      position = -(step * stepsLength + handlerMinTranslate);
    } else {
      position = step * stepsLength + handlerMinTranslate;
    }
    handlerState.position = position;
    values[id] = this.convertPositionToValue(position);
    return state;
  };

  public updateLimits = (states: Array<HandlerState>): Array<HandlerState> => {
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

  private getStepLength = (sliderLength: number): number => {
    const { step, minValue, maxValue } = this.sliderOptions;
    return Number(((sliderLength / (maxValue - minValue)) * step).toFixed(5));
  };

  private convertValueToPosition = (value: number, minTranslate: number): number => {
    const { sliderLength } = this.sliderParametrs;
    const { minValue, maxValue } = this.sliderOptions;
    return (sliderLength / (maxValue - minValue)) * value + minTranslate;
  };

  private convertPositionToValue = (position: number): string => {
    const { handlerMinTranslate } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;
    const { minValue, maxValue, step } = this.sliderOptions;
    let calcPosition = position;
    let count = this.getCount(step);
    const value = ((maxValue - minValue) / sliderLength) * (calcPosition - handlerMinTranslate);
    return value.toFixed(count);
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
