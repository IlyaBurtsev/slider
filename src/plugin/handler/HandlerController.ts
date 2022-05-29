import { Orientation } from '../../models/Orientation'
import { removeEvent } from '../utils/utils'

class HandlerController {
  private handler: HTMLElement
  private documentElement: HTMLElement
  private actions: Actions
  private currentPosition: number = 0
  private currentValue: number = 0
  private translate: number
  private length: number
  private viewConnector: ViewConnector
  private id: number
  private orientation: number
  private trigger: Function
  private eventsForTrigger: DataObject<string>

  constructor(bindElement: HTMLElement, options: HandlerOptions) {
    const { id, actions, viewConnector, orientation, trigger, customEvents: eventsForTrigger } = options
    // this.handler = viewConnector.createHandler(bindElement, id)
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

  public getId(): number {
    return this.id
  }

  public setCurrentPosition(position: number): void {
    this.currentPosition = position
  }

  public getCurrentPosition(): number {
    return this.currentPosition
  }

  public getHandlerTranslate(): number {
    return this.translate
  }

  public setHandlerTranslate(translate: number): void {
    this.translate = translate
  }

  public getHandlerLength(): number {
    return this.length
  }

  private setHandlerParametrs(orientation: number): void {
    const cs = window.getComputedStyle(this.handler, null)
    if (orientation === Orientation.Horizontal) {
      ;(this.translate = Number(cs.left.match(/[-\d][0-9]+/))),
        (this.currentPosition = Number(cs.left.match(/[-\d][0-9]+/))),
        (this.length = Number(cs.width.match(/[-\d][0-9]+/)))
    } else {
      ;(this.translate = Number(cs.top.match(/[-\d][0-9]+/))),
        (this.currentPosition = Number(cs.top.match(/[-\d][0-9]+/))),
        (this.length = Number(cs.height.match(/[-\d][0-9]+/)))
    }
  }

  private init(): void {
    this.bindEvents()
    this.setHandlerParametrs(this.orientation)
  }

  private bindEvents(): void {
    // bindEvent(this.actions.start.split(' '), this.onTouchHandler, this.handler)
  }

  private onTouchHandler = (event: BrowserEvent): void => {
    event.stopPropagation()

    if (!this.checkTouch(event)) {
      return
    }

    this.trigger(this.eventsForTrigger.onTouchHandler, this.getId())
    // bindEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement)
    // bindEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement)
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

  private onMoveHandler = (event: BrowserEvent): void => {
    const userPosition = this.getUsersHandlerPosition(event)
    this.trigger(this.eventsForTrigger.onMoveHandler, this.getId(), userPosition)
  }

  private onStopHandler = (event: BrowserEvent): void => {
    removeEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement)
    removeEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement)
    this.trigger(this.eventsForTrigger.onMoveHandler, this.getId())
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

export { HandlerController as Handler }
