import './example.scss';
import '../src/components/slider/slider';
// import './style/style.scss';
import './style/fonts.scss';
import './components/dropdown/dropdown.ts';
import { getElement } from '../src/plugin/utils/utils';

import DropdownConnector from 'dropdown/src/models/ViewConnector';
import createDropdownPlugin from 'dropdown/src/plugin/Plugin';
import { Payload, RootState as DropdownState } from '../../dropdown/src/models/types';
import { RootState } from '../src/models/types';

import getViewConnector from '../src/components/connector';
import createSliderPlugin from '../src/plugin/Plugin';
import { initDropdown, setValueToItem, switchButtonToActive, switchButtonToDisable } from './components/dropdown/dropdown';
import { UserOptions } from '../src/models/interfaces';
import dropdownChangeTypes from '../../dropdown/src/models/enums/ChangeStateTypes';
import ChangeStateTypes from '../src/models/enums/ChangeStateTypes';

const sliderContainer = getElement('.slider');
const view = getViewConnector(sliderContainer);
let number=1
const sliderPlugin = createSliderPlugin(view, {
  numberOfHandlers: number,
  step: 1,
  scaleStep: 10,
  toolTips: true,
  progressBar: true,
  scale: true,
});

const element = <HTMLElement>document.querySelector('.dropdown');
const dropdownView: DropdownConnector = initDropdown(element);
const {dropdown} = dropdownView

const checkState = (state: DropdownState, id: number, type: string): DropdownState => {
  const { itemStates } = state;
  const currentItem = itemStates[id];
  const { minValue, maxValue, value,incrementStep } = currentItem;

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
	if (type === dropdownChangeTypes.addButtonClicked){
		if (sliderPlugin.getHandlerValue(id-2) === sliderPlugin.getHandlerValue(id-1)) {
			switchButtonToActive(dropdown, id-1, true)
		}
	}
	if (type === dropdownChangeTypes.subButtonClicked){
		if (sliderPlugin.getHandlerValue(id-1) === sliderPlugin.getHandlerValue(id)) {
			switchButtonToActive(dropdown, id+1, false)
		}
	}
	currentItem.value = Number(value.toFixed(1))

  return state;
};
const stepName = 'set slider step';
const stepValue = 1;
const onChangeState = (state: DropdownState, payload: Payload): void => {
  const { itemStates } = state;
  const { id, changeType } = payload;
  if (id === undefined) {
    return;
  }
  if (id === 0) {
    if (changeType === dropdownChangeTypes.addButtonClicked || changeType === dropdownChangeTypes.subButtonClicked) {
      sliderPlugin.updateSliderOptions({ numberOfHandlers: itemStates[0].value });
    }
  }
  if (id > 0 && id <= itemStates[0].value) {
    sliderPlugin.moveHandlerTo(itemStates[id].value, id - 1);
		if (sliderPlugin.getHandlerValue(id-1) === sliderPlugin.getHandlerValue(id)){
			switchButtonToDisable(dropdown, id, true)
			setValueToItem(sliderPlugin.getHandlerValue(id), dropdown, id)
		}
		if(sliderPlugin.getHandlerValue(id-2) === sliderPlugin.getHandlerValue(id-1)){
			switchButtonToDisable(dropdown, id, false)
			setValueToItem(sliderPlugin.getHandlerValue(id-1), dropdown, id)
		}
  }
  if (id === itemStates[0].value + 1) {
    setSliderStep(itemStates[id].value, id);
		setIncrementStep(id, itemStates[id].value)
  }
};
let incrementStep = 1
const dropdownPlugin = createDropdownPlugin(dropdownView, {
  itemNames: ['set number of handlers', `set value for ${1} handler`, stepName],
  titlePlaceholder: 'title',
  startValues: [1, 0, 1],
  minValueItem: 0,
  incrementStep:incrementStep,
  externalCheckState: checkState,
});
dropdownPlugin.changeItemParametrs({minValue: 1}, 0)
dropdownPlugin.changeItemParametrs({ value: stepValue }, 2);
const addHandlersMovement = (number: number): void => {
  const names: Array<string> = ['set number of handlers', `set value for ${1} handler`];
  const values: Array<number> = [number, sliderPlugin.getHandlerValue(0)];
  if (number % 2 === 0) {
    for (let i = 2; i <= number; i += 1) {
      names.push(`set value for ${i} handler`);
      values.push(sliderPlugin.getHandlerValue(i-1));
    }
  }
  names.push(stepName);
  values.push(stepValue);
  dropdownPlugin.updateDropdownOptions({ itemNames: names, startValues: values });
	if (number >= 2){
		dropdownPlugin.changeItemParametrs({incrementStep: 2, minValue: 1}, 0)
	}else {
		dropdownPlugin.changeItemParametrs({minValue: 1}, 0)
	}

};

const setSliderStep = (step: number, id: number): void => {
  if (step === 0) {
    dropdownPlugin.changeItemParametrs({ value: 0.1 , minValue: 0.1}, id);
  } else {
		if (step === 1.1){
			dropdownPlugin.changeItemParametrs({ value: 1 }, id);
		}else {
			sliderPlugin.updateSliderOptions({ step: step});
		}
  }
};

const setIncrementStep = (count: number, step: number): void => {
	for (let i=1; i<count; i+=1) {
		dropdownPlugin.changeItemParametrs({incrementStep: step}, i)
	}
}
const values: Array<number> = [];

const onUpdateOptions = (options: UserOptions): void => {
  const { numberOfHandlers } = options;
  if (numberOfHandlers !== undefined) {
    addHandlersMovement(numberOfHandlers);
  }
	for (let i=0; i< number; i+=1) {
		const value = sliderPlugin.getHandlerValue(i);
		dropdownPlugin.changeItemParametrs({value: value}, i+1)
	}
};

const onSliderChangeState = (state: RootState, id: number, type: string): void => {
  const { handlerStates, valuesState } = state;
  if (id !== undefined) {
    if (type === ChangeStateTypes.handlerMovement || type === ChangeStateTypes.tapOnSlider) {
      dropdownPlugin.changeItemParametrs({ value: Number(valuesState.values[id]) }, id + 1);
    }
  }
};
sliderPlugin.subscribeToChangeState(onSliderChangeState);
dropdownPlugin.subscribeToChangeState(onChangeState);
sliderPlugin.onChangeOptions(onUpdateOptions);


