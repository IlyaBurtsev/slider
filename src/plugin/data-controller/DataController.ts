import { ChangeStateTypes } from '../../models/ChangeStateTypes';
import { PluginActions } from '../../models/PluginActions';
import { deepMerge } from '../utils/utils';

export default class DataController {
  private handlerParametrs: HandlerParametrs;
  private sliderParametrs: SliderParametrs;
  private scaleSize: number = 0;
  private options: SliderOptions = {
    numberOfHandlers: 1,
    minValue: 0,
    maxValue: 100,
    startValues: 0,
    step: 1,
    toolTips: false,
    progressBar: false,
    scale: false,
    scaleStep: 10,
  };
  private trigger: (actions: PluginActions, ...args: Array<Object>) => void;

  constructor(trigger: (actions: PluginActions, ...args: Array<Object>) => void, userOptions?: UserOptions) {
    this.updateOptions(userOptions);
    this.options = this.checkOptions(this.options);
    this.trigger = trigger;
  }
  //-----------------------------------------------------

  public getBindElelementPaddingParametrs = (): PaddingParametrs => {
    const { handlerMinTranslate, handlerTop, handlerBottom } = this.handlerParametrs;
    return {
      handlerMinTrahslate: handlerMinTranslate,
      handlerTop: handlerTop,
      handlerBottom: handlerBottom,
      scaleSize: this.scaleSize,
    };
  };

  public getScaleOptions = (): ScaleOptions => {
    const { scaleStep, maxValue, minValue, step } = this.options;
    const { sliderLength } = this.sliderParametrs;
    const { handlerBottom, handlerTop } = this.handlerParametrs;
    return {
      orientation: this.sliderParametrs.orientation,
      numberOfSteps: (maxValue - minValue) / step,
      scaleStep: scaleStep,
      sliderLength: sliderLength,
      handlerBottom: handlerBottom,
      handlerTop: handlerTop,
      callback: this.setScaleSize,
    };
  };

  public createTooltips = (): boolean => {
    return this.options.toolTips;
  };

  public createProgressBar = (): boolean => {
    return this.options.progressBar;
  };

  public createScale = (): boolean => {
    return this.options.scale;
  };

  public getOrientation = (): number => {
    return this.sliderParametrs.orientation;
  };

  public getNumberOfHandlers = (): number => {
    return this.options.numberOfHandlers;
  };

  public getHandlerBottom = (): number => {
    return this.handlerParametrs.handlerBottom;
  };

  public getSliderLength = (): number => {
    return this.sliderParametrs.sliderLength;
  };

  public getHandlerLength = (): number => {
    return this.handlerParametrs.handlerLength;
  };

  public getHandlerStartPosition = (): number => {
    return this.handlerParametrs.handlerMinTranslate;
  };

  //-----------------------------------------------------

  public setSliderParametrs = (parametrs: SliderParametrs): void => {
    this.sliderParametrs = parametrs;
  };

  public setHandlerParametrs = (parametrs: HandlerParametrs): void => {
    this.handlerParametrs = parametrs;
  };

  //-----------------------------------------------------

  public initState = (): RootState => {
    const handlerStates: Array<HandlerState> = [];
    const valuesState: ValuesState = {
      values: [],
    };
    const { values } = valuesState;
    const { numberOfHandlers, startValues, minValue, maxValue, step } = this.options;
    const { handlerMinTranslate, handlerMaxTranslate } = this.handlerParametrs;
    const minValueRange = this.getMinValuesRange();
    let count = this.getCount(step);

    if (numberOfHandlers > 1) {
      let correctData = true;
      if (Array.isArray(startValues)) {
        if (startValues.length !== numberOfHandlers) {
          correctData = false;
        }
        startValues.forEach((value, index) => {
          if (correctData) {
            correctData = setStatePosition(value, index, this);
          }
        });
      } else {
        correctData = false;
      }
      if (!correctData) {
        handlerStates.splice(0);
        values.splice(0);
        let currentValue: number;
        for (let i = 0; i < numberOfHandlers; i++) {
          let state: HandlerState = {
            position: 0,
            minTranslate: 0,
            maxTranslate: 0,
          };
          if (i !== 0) {
            currentValue = ((maxValue - minValue) * i) / (numberOfHandlers - 1);
            const different = currentValue % step;
            if (different !== 0) {
              currentValue = currentValue - different;
            }
          } else {
            currentValue = minValue;
          }
          state.position = this.convertValueToPosition(currentValue, handlerMinTranslate);
          values.push(`${currentValue.toFixed(count)}`);
          handlerStates.push(state);
        }
      }
      this.updateLimits(handlerStates);
    } else {
      let state: HandlerState = {
        position: 0,
        minTranslate: handlerMinTranslate,
        maxTranslate: handlerMaxTranslate,
      };
      let startValue: number = minValue;
      if (Array.isArray(startValues)) {
        if (startValues.length === 1) {
          startValue = startValues[0];
        }
      } else {
        startValue = startValues;
      }
      if (startValue >= minValue && startValue <= maxValue) {
        state.position = this.convertValueToPosition(startValue, handlerMinTranslate);
      } else {
        state.position = handlerMinTranslate;
        startValue = minValue;
      }

      values.push(`${startValue}`);
      handlerStates.push(state);
    }
    return {
      handlerStates: handlerStates,
      valuesState: valuesState,
    };

    function setStatePosition(value: number, index: number, that: DataController): boolean {
      let minCurrentValue: number = 0;

      let state: HandlerState = {
        position: 0,
        minTranslate: 0,
        maxTranslate: 0,
      };

      if (value % step !== 0) {
        return false;
      }
      if (!Array.isArray(startValues)) {
        return false;
      }

      if (value > maxValue) {
        return false;
      }
      if (index > 0) {
        minCurrentValue = startValues[index - 1] + minValueRange;
      } else {
        if (value < minCurrentValue) {
          return false;
        }
      }
      if (value < minCurrentValue) {
        if (value >= minCurrentValue - minValueRange && minCurrentValue + minValueRange <= maxValue) {
          state.position = that.convertValueToPosition(minCurrentValue, handlerMinTranslate);
          handlerStates.push(state);
          values.push(`${startValues[index - 1]}`);
          return true;
        } else {
          return false;
        }
      }

      if (value >= minCurrentValue) {
        if (minCurrentValue <= maxValue) {
          state.position = that.convertValueToPosition(value, handlerMinTranslate);
          handlerStates.push(state);
          values.push(`${value}`);
          return true;
        } else {
          return false;
        }
      }

      return false;
    }
  };

  public changeState = (state: RootState, newUserposition: number, id: number, type: ChangeStateTypes): RootState => {
    let newState: RootState;
    switch (type) {
      case ChangeStateTypes.handlerMovement:
        newState = this.changeStateWhenChangePosition(state, newUserposition, id);
        this.trigger(PluginActions.onChangeState, newState, id);
        return newState;
      case ChangeStateTypes.tapOnSlider:
        const handlerId = this.getClosestHandlerId(newUserposition, state.handlerStates);
        newState = this.changeStateWhenChangePosition(state, newUserposition, handlerId);
        this.updateLimits(state.handlerStates);
        this.trigger(PluginActions.onChangeState, newState, handlerId);
        return newState;
      case ChangeStateTypes.externalChangeValue:
        if (id >= state.handlerStates.length) {
          return state;
        }
        const { handlerMinTranslate } = this.handlerParametrs;
        const { sliderStartPosition } = this.sliderParametrs;
        const newPosition =
          this.convertValueToPosition(newUserposition, handlerMinTranslate) + sliderStartPosition - handlerMinTranslate;
        newState = this.changeStateWhenChangePosition(state, newPosition, id);
        this.updateLimits(state.handlerStates);
        this.trigger(PluginActions.onChangeState, newState, id);
        return newState;
      default:
        return state;
    }
  };

  public updateLimits = (states: Array<HandlerState>): Array<HandlerState> => {
    const { handlerMinTranslate, handlerMaxTranslate, handlerLength: startHandlerLength } = this.handlerParametrs;
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

  public getEventNames = (): Actions => {
    return (window.navigator as any).pointerEnabled
      ? {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup',
        }
      : (window.navigator as any).msPointerEnabled
      ? {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp',
        }
      : {
          start: 'mousedown touchstart',
          move: 'mousemove touchmove',
          end: 'mouseup touchend',
        };
  };

  //-----------------------------------------------------

  private updateOptions = (newOptions?: UserOptions): void => {
    if (newOptions) {
      this.options = deepMerge(this.options, false, newOptions);
    }
  };

  private changeStateWhenChangePosition = (state: RootState, newUserposition: number, id: number): RootState => {
    const { minValue, maxValue } = this.options;
    const sliderParametrs = this.sliderParametrs;
    const { sliderStartPosition, sliderLength } = sliderParametrs;
    const stepsLength = this.getStepLength(sliderLength);
    if (id === -1) {
      return state;
    }

    const { handlerMinTranslate, handlerLength: startHandlerLength } = this.handlerParametrs;

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
    let position: number = step * stepsLength + handlerMinTranslate;
    if (position > handlerState.minTranslate && position < handlerState.maxTranslate) {
      if (calcUserPosition < 0) {
        position = -position;
      }
      handlerState.position = position;
      values[id] = this.convertPositionToValue(position);
    }
    return state;
  };

  private getClosestHandlerId = (targetPosition: number, handlerStates: Array<HandlerState>): number => {
    if (handlerStates.length === 1) {
      return 0;
    }
    const { sliderStartPosition } = this.sliderParametrs;
    let calcPosition = targetPosition - sliderStartPosition;
    let closestHandlerId = 0;
    let minDistance = Math.abs(handlerStates[0].position - calcPosition);
    handlerStates.forEach((state, id) => {
      let currentDistance = Math.abs(state.position - calcPosition);
      if (currentDistance < minDistance) {
        minDistance = currentDistance;
        closestHandlerId = id;
      }
    });

    return closestHandlerId;
  };

  private getStepLength = (sliderLength: number): number => {
    const { step, minValue, maxValue } = this.options;
    return Number(((sliderLength / (maxValue - minValue)) * step).toFixed(5));
  };

  private convertValueToPosition = (value: number, minTranslate: number): number => {
    const { sliderLength } = this.sliderParametrs;
    const { minValue, maxValue } = this.options;
    return (sliderLength / (maxValue - minValue)) * value + minTranslate;
  };

  private convertPositionToValue = (position: number): string => {
    const { handlerMinTranslate } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;
    const { minValue, maxValue, step } = this.options;
    let calcPosition = position;
    let count = this.getCount(step);
    const value = ((maxValue - minValue) / sliderLength) * (calcPosition - handlerMinTranslate);
    return value.toFixed(count);
  };

  private getMinValuesRange = (): number => {
    const { minValue, maxValue } = this.options;
    const { handlerLength: startHandlerLength } = this.handlerParametrs;
    const { sliderLength } = this.sliderParametrs;

    return ((maxValue - minValue) * startHandlerLength) / sliderLength;
  };

  private getCount(step: number): number | undefined {
    if (step.toString().includes('.')) {
      return step.toString().split('.').pop()?.length;
    } else {
      return 0;
    }
  }

  private checkOptions = (options: SliderOptions): SliderOptions => {
    let { numberOfHandlers, minValue, maxValue, step } = options;

    if (numberOfHandlers > 1 && numberOfHandlers % 2 !== 0) {
      numberOfHandlers = 1;
      options.numberOfHandlers = 1;
    }
    if (minValue >= maxValue) {
      options.minValue = 0;
      options.maxValue = 100;
    }

    if ((maxValue - minValue) / numberOfHandlers <= step) {
      options.step = step / 10;
    }

    return options;
  };

  private setScaleSize = (size: number): void => {
    this.scaleSize = size;
  };
}
