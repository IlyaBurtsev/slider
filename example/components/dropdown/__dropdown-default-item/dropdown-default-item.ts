import './dropdown-default-item.scss';
import { Item } from 'dropdown/src/models/types';

type DefaultItemComponent = {
  item: Item;
  switchToActive: (item: HTMLElement | null, add: boolean) => void;
  switchToDisable: (item: HTMLElement | null, add: boolean) => void;
};

const initDefaultItem = (bindElement: HTMLElement): DefaultItemComponent => {
  const className = {
    defaultItemContainer: 'js-dropdown-item__container',
    title: 'js-dropdown-item__title',
    counter: 'js-dropdown-item__counter',
    addButton: 'js-dropdown-item__add-button',
    subButton: 'js-dropdown-item__sub-button',
    buttonActive: 'dropdown-item__button_active',
  };
  const container = <HTMLElement>bindElement.querySelector(`.${className.defaultItemContainer}`);
  if (container === null) {
    throw new Error('Default item container is null!');
  }

  const setValue = (value: string, parentElement: HTMLElement): void => {
    const counter = <HTMLInputElement>parentElement.querySelector(`.${className.counter}`);
    if (counter !== null) {
      counter.value = value;
    }
  };

  const setItemName = (name: string, parentElement: HTMLElement): void => {
    const title = <HTMLInputElement>parentElement.querySelector(`.${className.title}`);
    if (title !== null) {
      title.innerHTML = name;
    }
  };

  const item: Item = {
    container: container,
    addButtonClassName: className.addButton,
    subButtonClassName: className.subButton,
    setValue: setValue,
    setItemName: setItemName,
  };
  const switchToActive = (item: HTMLElement | null, add: boolean): void => {
    if (item !== null) {
      let button: HTMLElement;
      if (add) {
        button = <HTMLElement>item.querySelector(`.${className.addButton}`);
      } else {
        button = <HTMLElement>item.querySelector(`.${className.subButton}`);
      }
      if (button !== null) {
        if (!button.classList.contains(className.buttonActive)) {
          button.classList.add(className.buttonActive);
          button.removeAttribute('disabled');
        }
      }
    }
  };

  const switchToDisable = (item: HTMLElement | null, add: boolean): void => {
    if (item !== null) {
      let button: HTMLElement;
      if (add) {
        button = <HTMLElement>item.querySelector(`.${className.addButton}`);
      } else {
        button = <HTMLElement>item.querySelector(`.${className.subButton}`);
      }
      if (button !== null) {
        if (button.classList.contains(className.buttonActive)) {
          button.classList.remove(className.buttonActive);
          button.setAttribute('disabled', '');
        }
      }
    }
  };
  return {
    item: item,
    switchToActive: switchToActive,
    switchToDisable: switchToDisable,
  };
};

export default initDefaultItem;
