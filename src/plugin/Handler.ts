import { createHandler, isHandlerDisabled, switchHandlerToActive } from '../components/handler/handler'
import { bindEvent, removeEvent } from './utils/utils'

class Handler {
  private element: HTMLElement
	private documentElement: HTMLElement
  private actions: Actions
  private position: number = 0
  private onTouchHandlerTrigger: Function

  constructor(bindElement: HTMLElement, number: number, actions: Actions, onTouchHandlerTrigger?: Function) {
		this.element = createHandler(bindElement, number);
    this.actions = actions
		this.documentElement = this.element.ownerDocument.documentElement;
  }

	private init():void {
		
	}

  public getHandler(): HTMLElement {
    return this.element
  }
  protected setPosition(position: number): void {
    this.position = position
  }

  protected getPosition(): number {
    return this.position
  }

  private bindEvents(): void {
    bindEvent(this.actions.start.split(' '), this.onTouchHandler, this.element)
  }

  private onTouchHandler(event: BrowserEvent): void {
    const handler = event.target as HTMLElement
    if (isHandlerDisabled(handler)) {
      return
    }
    switchHandlerToActive(handler);
    event.stopPropagation();
		this.onTouchHandlerTrigger(handler)
    bindEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement);
    bindEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement);
  }

  private onMoveHandler(event: BrowserEvent): void {}

  private onStopHandler(event: BrowserEvent): void {
    const handler = event.target as HTMLElement

    removeEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement)
    removeEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement)
  }
}

export { Handler }
