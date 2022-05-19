import { isHandlerDisabled, switchHandlerToActive } from '../components/handler/handler'
import { Observer } from './observer/Observer'
import { bindEvent, removeEvent } from './utils/utils'

class Slider extends Observer {
  private sliderContainer: HTMLElement
  private actions: Actions
  private handlers: Array<Handler>
  constructor(bindElement: HTMLElement, options: object) {
    super()
    this.sliderContainer = bindElement
    this.init()
  }
  private init(): void {
    this.actions = this.prepareEventNames()

    this.bindEvents()
  }

  private bindEvents(): void {
    this.handlers.forEach((handler) =>
      bindEvent(this.actions.start.split(' '), this.onClickHandler, handler.getHandler())
    )
  }

  private onClickHandler(event: BrowserEvent): void {
		const handler = event.target as HTMLElement;
		if (isHandlerDisabled(handler)) {
			return;
		}
		switchHandlerToActive(handler);
		event.stopPropagation();
		bindEvent(this.actions.move.split(' '), this.onMoveHandler, handler);
		bindEvent(this.actions.end.split(' '), this.onStopHandler, handler);
	}

	private onMoveHandler(event: BrowserEvent): void {

	}

	private onStopHandler(event: BrowserEvent): void {
		const handler = event.target as HTMLElement;

		removeEvent(this.actions.move.split(' '), this.onMoveHandler, handler);
		removeEvent(this.actions.end.split(' '), this.onStopHandler, handler);
	}

  private prepareEventNames(): Actions {
    return (window.navigator as any).pointerEnabled
      ? {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup pointerout',
        }
      : (window.navigator as any).msPointerEnabled
      ? {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp MSPointerOut',
        }
      : {
          start: 'mousedown touchstart',
          move: 'mousemove touchmove',
          end: 'mouseup touchend mouseout',
        }
  }
}
