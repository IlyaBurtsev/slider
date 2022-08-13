import './example.scss';
import '../src/components/slider/slider';
import './style/style.scss';
import './style/fonts.scss';
import './components/dropdown/dropdown.ts';
import './components/vertical-star-slider/vertical-star-slider.ts';

import { getElement } from '../src/plugin/utils/utils';

import DropdownConnector from 'dropdown/src/models/ViewConnector';
import createDropdownPlugin from 'dropdown/src/plugin/Plugin';
import { Payload, RootState as DropdownState } from 'dropdown/src/models/types';
import dropdownChangeTypes from 'dropdown/src/models/enums/ChangeStateTypes';

import { RootState } from '../src/models/types';
import { UserOptions } from '../src/models/interfaces';
import ChangeStateTypes from '../src/models/enums/ChangeStateTypes';
import getViewConnector from '../src/components/connector';
import createSliderPlugin from '../src/plugin/Plugin';

import initVerticalStarSlider from './components/vertical-star-slider/vertical-star-slider';

import {
  getClosedButton,
  getToggleElement,
  initDropdown,
  setValueToItem,
  switchButtonToActive,
  switchButtonToDisable,
} from './components/dropdown/dropdown';
import { ViewConnector as SliderConnector } from '../src/models/ViewConnector';
import getScale from '../src/components/scale/scale';

const initSliderWithPanel = (sliderView: SliderConnector, dropdownView: DropdownConnector) => {
  let number = 1;
  let minValue = 10;
  let maxValue = 40;

  const sliderPlugin = createSliderPlugin(sliderView, {
    numberOfHandlers: number,
    minValue: minValue,
    maxValue: maxValue,
    step: 1,
    scaleStep: 10,
  });

  const { dropdown } = dropdownView;

  const checkState = (state: DropdownState, id: number, type: string): DropdownState => {
    const { itemStates } = state;
    const currentItem = itemStates[id];
    const { minValue, maxValue } = currentItem;
    let { value } = currentItem;

    if (value === minValue) {
      switchButtonToDisable(dropdown, id, false);
    } else {
      switchButtonToActive(dropdown, id, false);
    }
    if (value === maxValue) {
      switchButtonToDisable(dropdown, id, true);
    } else {
      switchButtonToActive(dropdown, id, true);
    }
    if (type === dropdownChangeTypes.addButtonClicked) {
      if (sliderPlugin.getHandlerValue(id - 2) === sliderPlugin.getHandlerValue(id - 1)) {
        switchButtonToActive(dropdown, id - 1, true);
      }
    }
    if (type === dropdownChangeTypes.subButtonClicked) {
      if (sliderPlugin.getHandlerValue(id - 1) === sliderPlugin.getHandlerValue(id)) {
        switchButtonToActive(dropdown, id + 1, false);
      }
    }
    if (id === itemStates[0].value + 2 && type === dropdownChangeTypes.addButtonClicked) {
      if (value >= itemStates[id + 1].value) {
        value -= itemStates[id].incrementStep;
        switchButtonToDisable(dropdown, id, true);
      } else {
        switchButtonToActive(dropdown, id, true);
      }
    }
		if (id === itemStates[0].value + 3 && type === dropdownChangeTypes.subButtonClicked) {
      if (value <= itemStates[id - 1].value) {
        value += itemStates[id].incrementStep;
        switchButtonToDisable(dropdown, id, false);
      } else {
        switchButtonToActive(dropdown, id, false);
      }
    }
    currentItem.value = Number(value.toFixed(1));
    return state;
  };

  const stepName = 'set slider step';
  const params = ['set slider step', 'set min value', 'set max value'];
  const stepValue = 1;

  const dropdownPlugin = createDropdownPlugin(dropdownView, {
    itemNames: ['set number of handlers', `set value for ${1} handler`, ...params],
    titlePlaceholder: 'Configuration Panel',
    startValues: [1, 0, 1, minValue, maxValue],
    minValueItem: 0,
    maxValueItem: 10000000,
    incrementStep: 1,
    externalCheckState: checkState,
    autoClose: false,
  });

  dropdownPlugin.changeItemParametrs({ incrementStep: 10 }, 3);
  dropdownPlugin.changeItemParametrs({ incrementStep: 10 }, 4);
  dropdownPlugin.changeItemParametrs({ minValue: minValue, maxValue: maxValue }, 1);

  const closedButton = getClosedButton(dropdown);

  closedButton.addEventListener('click', dropdownPlugin.closedDropdown);

  const onDropdownChangeState = (state: DropdownState, payload: Payload): void => {
    const { itemStates } = state;
    const { id, changeType } = payload;
    if (id === undefined) {
      return;
    }
    if (id === 0) {
      if (changeType === dropdownChangeTypes.addButtonClicked || changeType === dropdownChangeTypes.subButtonClicked) {
        const count = itemStates[0].value;
        sliderPlugin.updateSliderOptions({ numberOfHandlers: count });
        dropdownPlugin.changeItemParametrs({ incrementStep: 10 }, count + 2);
        dropdownPlugin.changeItemParametrs({ incrementStep: 10 }, count + 3);
        dropdownPlugin.changeItemParametrs({ minValue: minValue }, 1);
        dropdownPlugin.changeItemParametrs({ maxValue: maxValue }, count);
      }
    }
    if (id > 0 && id <= itemStates[0].value) {
      const { value } = itemStates[id];
      sliderPlugin.moveHandlerTo(value, id - 1);
      if (sliderPlugin.getHandlerValue(id - 1) === sliderPlugin.getHandlerValue(id)) {
        switchButtonToDisable(dropdown, id, true);
        setValueToItem(sliderPlugin.getHandlerValue(id), dropdown, id);
      }
      if (sliderPlugin.getHandlerValue(id - 2) === sliderPlugin.getHandlerValue(id - 1)) {
        switchButtonToDisable(dropdown, id, false);
        setValueToItem(sliderPlugin.getHandlerValue(id - 1), dropdown, id);
      }
    }
    if (id === itemStates[0].value + 1) {
      setSliderStep(itemStates[id].value, id);
      setIncrementStep(id, itemStates[id].value);
    }
    if (id === itemStates[0].value + 2) {
      minValue = itemStates[id].value;
      sliderPlugin.updateSliderOptions({ minValue: minValue });
      dropdownPlugin.changeItemParametrs({ minValue: minValue }, 1);
    }
    if (id === itemStates[0].value + 3) {
      maxValue = itemStates[id].value;
      sliderPlugin.updateSliderOptions({ maxValue: maxValue });
      dropdownPlugin.changeItemParametrs({ maxValue: maxValue }, itemStates[0].value);
    }
  };

  dropdownPlugin.changeItemParametrs({ minValue: 1 }, 0);
  dropdownPlugin.changeItemParametrs({ value: stepValue }, 2);

  const addHandlersMovement = (number: number): void => {
    const names: Array<string> = ['set number of handlers', `set value for ${1} handler`];
    const values: Array<number> = [number, sliderPlugin.getHandlerValue(0)];
    if (number % 2 === 0) {
      for (let i = 2; i <= number; i += 1) {
        names.push(`set value for ${i} handler`);
        values.push(sliderPlugin.getHandlerValue(i - 1));
      }
    }
    names.push(...params);
    values.push(stepValue, minValue, maxValue);
    dropdownPlugin.updateDropdownOptions({ itemNames: names, startValues: values });
    if (number >= 2) {
      dropdownPlugin.changeItemParametrs({ incrementStep: 2, minValue: 1 }, 0);
    } else {
      dropdownPlugin.changeItemParametrs({ minValue: 1 }, 0);
    }
  };

  const setSliderStep = (step: number, id: number): void => {
    if (step === 0) {
      dropdownPlugin.changeItemParametrs({ value: 0.1, minValue: 0.1 }, id);
    } else {
      if (step === 1.1) {
        dropdownPlugin.changeItemParametrs({ value: 1 }, id);
      } else {
        sliderPlugin.updateSliderOptions({ step: step });
      }
    }
  };

  const setIncrementStep = (count: number, step: number): void => {
    for (let i = 1; i < count; i += 1) {
      dropdownPlugin.changeItemParametrs({ incrementStep: step }, i);
    }
  };

  const onSliderUpdateOptions = (options: UserOptions): void => {
    const { numberOfHandlers } = options;
    if (numberOfHandlers !== undefined) {
      number = numberOfHandlers;
      addHandlersMovement(numberOfHandlers);
    }
    for (let i = 0; i < number; i += 1) {
      const value = sliderPlugin.getHandlerValue(i);
      dropdownPlugin.changeItemParametrs({ value: value }, i + 1);
    }
  };

  const onSliderChangeState = (state: RootState, id: number, type: string): void => {
    const { valuesState } = state;
    if (id !== undefined) {
      if (type === ChangeStateTypes.handlerMovement || type === ChangeStateTypes.tapOnSlider) {
        dropdownPlugin.changeItemParametrs({ value: Number(valuesState.values[id]) }, id + 1);
      }
    }
  };

  sliderPlugin.subscribeToChangeState(onSliderChangeState);
  dropdownPlugin.subscribeToChangeState(onDropdownChangeState);
  sliderPlugin.onChangeOptions(onSliderUpdateOptions);

  const toggleScaleElement = getToggleElement(dropdown, number + 4);
  sliderPlugin.updateSliderOptions({ scale: toggleScaleElement.checked });
  const onTogglescale = (e: MouseEvent): void => {
    const toggle: HTMLInputElement = e.target as HTMLInputElement;
    sliderPlugin.updateSliderOptions({ scale: toggle.checked });
  };
  sliderPlugin.updateSliderOptions({ scale: toggleScaleElement.checked });
  toggleScaleElement.addEventListener('click', onTogglescale);

  const toggleTooltipElement = getToggleElement(dropdown, number + 5);
  const onToggleTooltip = (e: MouseEvent): void => {
    const toggle: HTMLInputElement = e.target as HTMLInputElement;
    sliderPlugin.updateSliderOptions({ toolTips: toggle.checked });
  };
  sliderPlugin.updateSliderOptions({ toolTips: toggleTooltipElement.checked });
  toggleTooltipElement.addEventListener('click', onToggleTooltip);

  const toggleProgressbarElement = getToggleElement(dropdown, number + 6);
  const onToggleBar = (e: MouseEvent): void => {
    const toggle: HTMLInputElement = e.target as HTMLInputElement;
    sliderPlugin.updateSliderOptions({ progressBar: toggle.checked });
  };
  sliderPlugin.updateSliderOptions({ progressBar: toggleProgressbarElement.checked });
  toggleProgressbarElement.addEventListener('click', onToggleBar);
};

const verticalSlideContainer = <HTMLElement>document.querySelector('.vertical-slider');
const sliderVerticalView: SliderConnector = initVerticalStarSlider(verticalSlideContainer);
sliderVerticalView.scaleElements = getScale(sliderVerticalView.slider);

const dropdownContainerVertical = <HTMLElement>document.querySelector('.vertical-slider');
const dropdownViewVertical: DropdownConnector = initDropdown(dropdownContainerVertical);
initSliderWithPanel(sliderVerticalView, dropdownViewVertical);

const sliderContainer = getElement('.slider');
const sliderView = getViewConnector(sliderContainer);
const dropdownContainer = <HTMLElement>document.querySelector('.dropdown');
const dropdownView: DropdownConnector = initDropdown(dropdownContainer);

initSliderWithPanel(sliderView, dropdownView);
