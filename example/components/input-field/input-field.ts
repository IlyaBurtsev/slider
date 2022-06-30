import './input-field.scss';

const initInput = (bindElement: HTMLElement): ((value: string) => void) => {
  const className = {
    input: 'js-input-field__input',
  };
  const input = <HTMLInputElement>bindElement.querySelector(`.${className.input}`);
  const setValue = (value: string): void => {
    input.innerHTML = value;
  };
  return setValue;
};

export default initInput