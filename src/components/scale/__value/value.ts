import { createElement } from '../../../plugin/utils/utils';

const createValue = (bindElement: HTMLElement): HTMLElement => {
  const className = {
    value: 'scale__value',
  };
  const value = createElement({ className: className.value });
  bindElement.append(value);
  return value;
};

export {createValue}
