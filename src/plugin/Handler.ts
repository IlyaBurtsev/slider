
import { bindEvent, removeEvent } from './utils/utils'

class Handler {
  private element: HTMLElement
	private documentElement: HTMLElement
  private actions: Actions
  private position: number = 0;
	private viewConnector: ViewConnector;
  private trigger: Function

  constructor(bindElement: HTMLElement, number: number, actions: Actions, viewConnector: ViewConnector, trigger?: Function) {
		this.element = viewConnector.createHandler(bindElement, number);
    this.actions = actions
		this.documentElement = this.element.ownerDocument.documentElement;
		this.viewConnector = viewConnector;
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
    event.stopPropagation();
		this.trigger(handler)
    bindEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement);
    bindEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement);
  }

  private onMoveHandler(event: BrowserEvent): void {}

  private onStopHandler(event: BrowserEvent): void {
    const handler = event.target as HTMLElement

    removeEvent(this.actions.move.split(' '), this.onMoveHandler, this.documentElement)
    removeEvent(this.actions.end.split(' '), this.onStopHandler, this.documentElement)
  }
	private moveHandlerTo = (handler: HTMLElement, translateX: number, translateY: number):void => {
		handler.style.transform = `translate ${translateX}%`
	}
}

export { Handler }
