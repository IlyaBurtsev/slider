import { Orientation } from '../models/Orientation'
import { bindEvent, removeEvent } from './utils/utils'

class Handler {
  private handler: HTMLElement
  private documentElement: HTMLElement
  private actions: Actions
  private position: number = 0
  private viewConnector: ViewConnector
  private id: number
  private orientation: number
  private trigger: Function
  private eventsForTrigger: DataObject<string>

  constructor(bindElement: HTMLElement, options: HandlerOptions) {
    const { id, actions, viewConnector, orientation, trigger, eventsForTrigger } = options
    this.handler = viewConnector.createHandler(bindElement, id)
    this.id = id
    this.actions = actions
    this.documentElement = this.handler.ownerDocument.documentElement
    this.viewConnector = viewConnector
    this.orientation = orientation
    this.trigger = trigger
    this.eventsForTrigger = eventsForTrigger

    this.init()
  }

  

  public getHandler(): HTMLElement {
    return this.handler
  }
	public getStartPosition(): number {
		if (this.orientation === Orientation.Horizontal) {
			return this.handler.getBoundingClientRect().left
		}else {
			return this.handler.getBoundingClientRect().top
		}
	}
  public setPosition(position: number): void {
    this.position = position
  }

  public getPosition(): number {
    return this.position
  }

	private init(): void {
    this.bindEvents()
  }

  private bindEvents(): void {
    bindEvent(this.actions.start.split(' '), this.onTouchHandler, this.handler)
  }

  private onTouchHandler = (event: BrowserEvent): void => {
    const handler = event.target as HTMLElement
    event.stopPropagation()

    if (!this.checkTouch(event)) {
      return
    }
		this.viewConnector.getHandlerId(handler)
    this.trigger(this.eventsForTrigger.onTouchHandler, this.viewConnector.getHandlerId(handler))
    bindEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement, handler)
    bindEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement, handler)
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

  private onMoveHandler = (event: BrowserEvent, handler: HTMLElement): void => {
    const userPosition = this.getUsersHandlerPosition(event)
		this.trigger(this.eventsForTrigger.onMoveHandler, this.viewConnector.getHandlerId(handler), userPosition, handler)
  }

  private onStopHandler = (event: BrowserEvent, handler: HTMLElement): void => {

    removeEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement, handler)
    removeEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement, handler)
  }
  public moveHandlerToPosition = (newPosition: number): void => {
    if (this.orientation === Orientation.Horizontal) {
      this.handler.style.left = `${newPosition}px`
    } else {
      this.handler.style.top = `${newPosition}px`
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
}

export { Handler }
