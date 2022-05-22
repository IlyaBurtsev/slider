import './handler.scss'
import { addClass, createElement, hasClass, removeClass } from "../../plugin/utils/utils"

const className = {
	handler: 'handler',
	activeHandler: 'handler_active',
	disabledHandler: 'handler_disabled'
}

const attribute: DataStringObject = {
	handlerNumber: 'handler-number'
}

const createHandler = (bindElement: HTMLElement, handlerNumber: number): HTMLElement => {
	const handler = createElement({className: className.handler, attrs: {'handler-number':`${handlerNumber}`}});
	bindElement.append(handler);
	return handler;
}

const getHandlerNumber = (handler: HTMLElement):number =>{
	const number = handler.getAttribute(attribute.hadlerNumber);
	if (typeof number === 'number'){
		return number;
	}else return 0
}


const switchHandlerToActive = (handler: HTMLElement): void => {
	addClass(handler, className.activeHandler);
}

const switchHandlerToDisabled = (handler: HTMLElement): void => {
	if (hasClass(handler, className.activeHandler)){
		removeClass(handler, className.activeHandler)
	}
	addClass(handler, className.disabledHandler)
}


const isHandlerDisabled = (handler: HTMLElement): boolean => {
	if (hasClass(handler, className.disabledHandler)){
		return true;
	}else {
		return false;
	}
}

export {createHandler, switchHandlerToActive, switchHandlerToDisabled, isHandlerDisabled, getHandlerNumber}