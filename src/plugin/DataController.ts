export default class DataController {
  private handlerParametrs: HandlerParametrs;
  private sliderParametrs: SliderParametrs;
  private sliderOptions: SliderOptions;
  private stepsLength: number;

  constructor(sliderOptions: SliderOptions) {
    this.sliderOptions = sliderOptions;
  }

  public setSliderParametrs = (parametrs: SliderParametrs): void =>{
    this.sliderParametrs = parametrs;
    this.setStepLength();
  }

  public getSliderLength = (): number => {
    return this.sliderParametrs.sliderLength;
  }

  public setHandlerParametrs = (parametrs: HandlerParametrs): void =>{
    this.handlerParametrs = parametrs;
  }

  public initState = (): Array<State> => {
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
          startValues.forEach((pair) => {
            if (Array.isArray(pair)) {
              if (pair.length === 2 && correctData) {
                pair.forEach((value) => {
                  if (value >= minCurrentValue && value <= maxValue) {
                    let state: State = {
                      position: this.convertValueToPosition(value, handlerMinTranslate),
                      minTranslate: 0,
                      maxTranslate: 0,
                    };
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
			this.setLimits(states, handlerMinTranslate, handlerMaxTranslate);
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

  private setLimits = (states: Array<State>, startTranslate: number, endTranslate: number): Array<State> => {
    states.forEach((state, index) => {
      if (index - 1 >= 0) {
        state.minTranslate = states[index - 1].position;
        states[index - 1].maxTranslate = state.position;
      } else {
        state.minTranslate = startTranslate;
      }
      if (index === states.length - 1) {
        state.maxTranslate = endTranslate;
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
}
