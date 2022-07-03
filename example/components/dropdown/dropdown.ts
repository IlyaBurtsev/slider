import './dropdown.scss';
import './__dropdown-default-item/dropdown-default-item';
import './__dropdown-toggle-item/dropdown-toggle-item';
import '../input-field/input-field';
import initInput from '../input-field/input-field';
import { initDefaultItem, switchToActive, switchToDisable } from './__dropdown-default-item/dropdown-default-item';
import ViewConnector from 'dropdown/src/models/ViewConnector';
import { getToggle } from '../toggle/toggle';
let setValueTo: (value: string, parentElement: HTMLElement) => void;
const initDropdown = (bindElement: HTMLElement): ViewConnector => {
  const className = {
    dropdownContainer: 'js-dropdown__container',
    dropdownOpen: 'dropdown__container_open',
    buttonActive: 'dropdown-item__button_active',
  };

  const container = <HTMLElement>bindElement.querySelector(`.${className.dropdownContainer}`);
  if (container === null) {
    throw new Error('Dropdown container is null!');
  }
  const setValueToInput = initInput(container);
  const defaultItem = initDefaultItem(container);
  const { setValue } = defaultItem;
  setValueTo = setValue;
  const openDropdown = (): void => {
    container.classList.add(className.dropdownOpen);
  };
  const closeDropdown = (): void => {
    // container.classList.remove(className.dropdownOpen);
  };

  return {
    dropdown: container,
    setValueToInput: setValueToInput,
    openDropdown: openDropdown,
    closedDropdown: closeDropdown,
    item: defaultItem,
  };
};

const switchButtonToActive = (dropdown: HTMLElement, id: number, add: boolean): void => {
  const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
  switchToActive(item, add);
};

const setValueToItem = (value: number, dropdown: HTMLElement, id: number): void => {
  const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
  setValueTo(`${value}`, item);
};

const switchButtonToDisable = (dropdown: HTMLElement, id: number, add: boolean): void => {
  const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
  switchToDisable(item, add);
};

const getToggleElement = (dropdown: HTMLElement, id: number): HTMLInputElement => {
  const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
  return getToggle(item);
};


export { initDropdown, switchButtonToActive, switchButtonToDisable, setValueToItem, getToggleElement };
