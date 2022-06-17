import './handler.scss';
import { addClass, createElement } from '../../plugin/utils/utils';

const className = {
  handler: 'handler',
  handlerVertical: 'handler_vertical',
};

const createHandler = (bindElement: HTMLElement): HTMLElement => {
  const handler = createElement({ className: className.handler });
  bindElement.append(handler);
  return handler;
};

const createHandlerVertival = (handler: HTMLElement): void => {
  addClass(handler, className.handlerVertical);
};

export { createHandler, createHandlerVertival };
