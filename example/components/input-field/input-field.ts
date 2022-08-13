import './input-field.scss';
import './_subscription/input-field_subscription.scss';
import './_for-date-dropdown/input-field_for-date-dropdown.scss';
import './_for-items-dropdown/input-field_for-items-dropdown.scss';

type InputComponent = {
  getInput: () => HTMLInputElement;
	getValue: () => string;
  setValue: (value: string) => void;
};

const initInput = (bindElement: HTMLElement): InputComponent => {
  const className = {
    input: 'js-input-field__input',
  };
  const input = <HTMLInputElement>bindElement.querySelector(`.${className.input}`);
  return {
    getInput: (): HTMLInputElement => {
      return input;
    },
		getValue: (): string => {
			return input.value
		},
    setValue: (value: string): void => {
      input.value = value;
    },
  };
};

export { InputComponent as InputType, initInput };
