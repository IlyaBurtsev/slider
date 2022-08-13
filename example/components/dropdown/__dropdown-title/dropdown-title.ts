import './dropdown-title.scss';

const initDropdownTitle = (bindElement: HTMLElement): ((value: string) => void) => {
  const className = {
    title: 'js-dropdown-title__title',
  };
  const input = <HTMLInputElement>bindElement.querySelector(`.${className.title}`);
  const setValue = (value: string): void => {
    input.innerHTML = value;
  };
  return setValue;
};

export default initDropdownTitle;
