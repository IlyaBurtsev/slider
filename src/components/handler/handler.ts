import './handler.scss'
import { addClass, createElement, hasClass, removeClass } from "../../plugin/utils/utils"

const className = {
	handlerContainer: 'handler__container',
	handler: 'handler'
}

const createHandler = (): HTMLElement => {
	const container = createElement({className: className.handlerContainer});
	container.append(createElement({className: className.handler}));
	return container;
}

const moveHandlerTo = (handler: HTMLElement, percent: number):void => {
	handler.style.transform = `translate ${percent}%`
}

const switchHandlerToActive = (handler: HTMLElement): void => {
	addClass(handler, 'handler_active');
}

const switchHandlerToDisabled = (handler: HTMLElement): void => {
	if (hasClass(handler, 'handler_active')){
		removeClass(handler, 'handler_active')
	}
	addClass(handler, 'handler_disabled')
}


const isHandlerDisabled = (handler: HTMLElement): boolean => {
	if (hasClass(handler, 'handler_disabled')){
		return true;
	}else {
		return false;
	}
}

export {createHandler, moveHandlerTo, switchHandlerToActive, switchHandlerToDisabled, isHandlerDisabled}