import './handler.scss'
import { addClass, createElement, hasClass, removeClass } from "../../plugin/utils/utils"

const className = {
	handler: 'handler',
	activeHandler: 'handler_active',
	disabledHandler: 'handler_disabled'
}

const createHandler = (bindElement: HTMLElement, sliderNumber: number): HTMLElement => {
	const handler = createElement({className: className.handler, attrs: {'slider-number':`${sliderNumber}`}});
	bindElement.append(handler);
	return handler;
}

const moveHandlerTo = (handler: HTMLElement, percent: number):void => {
	handler.style.transform = `translate ${percent}%`
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

export {createHandler, moveHandlerTo, switchHandlerToActive, switchHandlerToDisabled, isHandlerDisabled}