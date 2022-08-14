import './toggle.scss';

const getToggle = (bindElement: HTMLElement): HTMLInputElement => {
  const className = {
    input: 'js-toggle__input',
  };
  return <HTMLInputElement>bindElement.querySelector(`.${className.input}`);
};

export { getToggle };
