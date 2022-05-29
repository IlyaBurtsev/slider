import { Orientation } from '../../models/Orientation'
import { removeEvent } from '../utils/utils'

class HandlerListener {
  private actions: Actions
  private handler: HTMLElement
	private id: number;
  private documentElement: HTMLElement
  private orientation: number
  private customEvents: DataObject<string>
  private trigger: Function

  constructor(handler: HTMLElement, id: number, orientation: number, trigger: Function, customEvents: DataObject<string>) {
    this.orientation = orientation
    this.actions = this.prepareEventNames()
    this.handler = handler
		this.id = id;
    this.documentElement = this.handler.ownerDocument.documentElement
    this.trigger = trigger
    this.customEvents = customEvents
  }

  private bindEvents(handler: HTMLElement): void {
    this.bindEvent(this.actions.start.split(' '), this.onTouchHandler, handler)
  }

  private onTouchHandler = (event: BrowserEvent): void => {
    event.stopPropagation()

    if (!this.checkTouch(event)) {
      return
    }

    this.trigger(this.customEvents.onTouchHandler, this.id)
    this.bindEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement)
    this.bindEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement)
  }

  private onMoveHandler = (event: BrowserEvent): void => {
    const userPosition = this.getUsersHandlerPosition(event)
    this.trigger(this.customEvents.onMoveHandler, this.handler, this.id, userPosition)
  }

  private onStopHandler = (event: BrowserEvent): void => {
    removeEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement)
    removeEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement)
    this.trigger(this.customEvents.onStopHandler, this.id)
  }

  private bindEvent(
    events: Array<string>,
    listener: EventListener,
    element: HTMLElement,
    supportPassive?: boolean
  ): void {
    events.forEach((eventName) =>
      element.addEventListener(eventName, listener, supportPassive ? { passive: true } : false)
    )
  }

  private getUsersHandlerPosition = (event: BrowserEvent): number | boolean => {
    let x: number = 0
    let y: number = 0
    if (event.type.indexOf('touch') === 0) {
      const targetTouch = this.checkTouch(event)
      if (!targetTouch) {
        return false
      }
      x = (targetTouch as Touch).pageX
      y = (targetTouch as Touch).pageY
    } else {
      x = event.clientX
      y = event.clientY
    }
    if (this.orientation === Orientation.Horizontal) {
      return x
    } else {
      return y
    }
  }

  private checkTouch = (event: BrowserEvent): boolean | Touch => {
    if (event.type.indexOf('touch') === 0) {
      const touches = Array.prototype.filter.call(event.touches, this.isTouchOnTarget)

      // Do not support more than one touch per handle.
      if (touches.length > 1) {
        return false
      } else {
        return touches[0]
      }
    } else {
      return true
    }
  }

  private isTouchOnTarget = (event: BrowserEvent, currentTouch: Touch): boolean => {
    const target: HTMLElement = currentTouch.target as HTMLElement

    return (
      target === this.handler ||
      this.handler.contains(target) ||
      (event.composed && event.composedPath().shift() === this.handler)
    )
  }

  private prepareEventNames(): Actions {
    return (window.navigator as any).pointerEnabled
      ? {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup',
        }
      : (window.navigator as any).msPointerEnabled
      ? {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp',
        }
      : {
          start: 'mousedown touchstart',
          move: 'mousemove touchmove',
          end: 'mouseup touchend',
        }
  }
}

export { HandlerListener }
