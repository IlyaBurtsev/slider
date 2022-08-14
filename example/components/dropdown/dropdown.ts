import './dropdown.scss';
import './__dropdown-default-item/dropdown-default-item';
import './__dropdown-toggle-item/dropdown-toggle-item';
import './__dropdown-title/dropdown-title';
import '../button/button';
import './__dropdown-input-item/dropdown-input-item';
import initDropdownTitle from './__dropdown-title/dropdown-title';
import initDefaultItem from './__dropdown-default-item/dropdown-default-item';
import ViewConnector from 'dropdown/src/models/ViewConnector';
import { getToggle } from '../toggle/toggle';

type DropdownComponent = {
  view: ViewConnector;
  switchButtonToActive: (dropdown: HTMLElement, id: number, add: boolean) => void;
  switchButtonToDisable: (dropdown: HTMLElement, id: number, add: boolean) => void;
  setValueToItem: (value: number, dropdown: HTMLElement, id: number) => void;
  getToggleElement: (dropdown: HTMLElement, id: number) => HTMLInputElement;
  getClosedButton: (dropdown: HTMLElement) => HTMLInputElement;
};

const initDropdown = (bindElement: HTMLElement): DropdownComponent => {

  const className = {
    dropdownContainer: 'js-dropdown__container',
    closedButton: 'js-button__container_link',
    dropdownOpen: 'dropdown__container_open',
    buttonActive: 'dropdown-item__button_active',
  };

  const container = <HTMLElement>bindElement.querySelector(`.${className.dropdownContainer}`);
  if (container === null) {
    throw new Error('Dropdown container is null!');
  }
  const setValueToInput = initDropdownTitle(container);
  const defaultItemComponent = initDefaultItem(container);
  const { item, switchToActive, switchToDisable } = defaultItemComponent;
  const { setValue } = item;
  const openDropdown = (): void => {
    container.classList.add(className.dropdownOpen);
  };
  const closedDropdown = (): void => {
    container.classList.remove(className.dropdownOpen);
  };
  const switchButtonToActive = (dropdown: HTMLElement, id: number, add: boolean): void => {
    const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
    switchToActive(item, add);
  };

  const setValueToItem = (value: number, dropdown: HTMLElement, id: number): void => {
    const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
    setValue(`${value}`, item);
  };

  const switchButtonToDisable = (dropdown: HTMLElement, id: number, add: boolean): void => {
    const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
    switchToDisable(item, add);
  };

  const getToggleElement = (dropdown: HTMLElement, id: number): HTMLInputElement => {
    const item: HTMLElement = dropdown.lastElementChild?.children[id] as HTMLElement;
    return getToggle(item);
  };

  const getClosedButton = (dropdown: HTMLElement): HTMLInputElement => {
    return <HTMLInputElement>dropdown.querySelector(`.${className.closedButton}`);
  };

  const view = {
    dropdown: container,
    setValueToInput,
    openDropdown,
    closedDropdown,
    item,
  };

  return {
    view,
    switchButtonToActive,
    switchButtonToDisable,
    setValueToItem,
    getToggleElement,
    getClosedButton,
  };
};

export { initDropdown, DropdownComponent };
