import './handler.scss'
import { addClass, createElement, hasClass, removeClass } from '../../plugin/utils/utils'

const className = {
  handler: 'handler',
  activeHandler: 'handler_active',
  disabledHandler: 'handler_disabled',
}

const createHandler = (bindElement: HTMLElement): HTMLElement => {
  const handler = createElement({ className: className.handler})
  bindElement.append(handler)
  return handler
}

const getHandlerNumber = (handler: HTMLElement): number => {
  const number = Number(handler.getAttribute('handler-number'))
  if (isNaN(number)) {
    return 0
  }
	return number
}

const switchHandlerToActive = (handler: HTMLElement): void => {
  addClass(handler, className.activeHandler)
}

const switchHandlerToDisabled = (handler: HTMLElement): void => {
  if (hasClass(handler, className.activeHandler)) {
    removeClass(handler, className.activeHandler)
  }
  addClass(handler, className.disabledHandler)
}

const isHandlerDisabled = (handler: HTMLElement): boolean => {
  if (hasClass(handler, className.disabledHandler)) {
    return true
  } else {
    return false
  }
}

export { createHandler, switchHandlerToActive, switchHandlerToDisabled, isHandlerDisabled, getHandlerNumber }
