import { bindEvent, deepMerge, removeEvent } from './utils/utils'
import { Handler } from './Handler'
import { Observer } from './observer/Observer'
import { Orientation } from '../models/Orientation'

class Slider extends Observer {
  private slider: HTMLElement
  private actions: Actions
  private handlers: Array<Handler> = []
  private position: number
	private startPosition: number
	private endPosition: number
	private stepsLength: number
  private options: SliderOptions
  private viewConnector: ViewConnector
  private defaultOptions: SliderOptions = {
    orientation: Orientation.Horizontal,
    numberOfDraggableRanges: 1,
		minValue: 0,
		maxValue: 100,
		step: 1
  }
  private customEvents = {
    onTouchHandler: 'onTouchHandler',
    onMoveHandler: 'onMoveHandler',
  }
  constructor(bindElement: HTMLElement | null, viewConnector: ViewConnector, newOptions?: UserOptions) {
    super()
    if (!bindElement) {
      return
    }
    this.slider = viewConnector.createSlider(bindElement)
    this.updateOptions(newOptions)
    this.viewConnector = viewConnector

    this.init()
  }

  private init(): void {
    this.actions = this.prepareEventNames()
    this.position = this.getPosition(this.options.orientation)
    this.createHandlers()
		this.startPosition = this.handlers[0].getStartPosition();
		this.setEndPositionAndStepLength();
    this.bindEvents()
  }

  private bindEvents(): void {
    this.on(this.customEvents.onMoveHandler, this.onMoveHandler)
  }

  private getPosition(orientation: number): number {
    const rect = this.slider.getBoundingClientRect()
    if (orientation === Orientation.Horizontal) {
      return rect.left
    } else {
      return rect.top
    }
  }

  private updateOptions(newOptions?: UserOptions): void {
    if (newOptions) {
      this.options = deepMerge(this.defaultOptions, newOptions)
    } else {
      this.options = this.defaultOptions
    }
  }

  private createHandlers(): void {
    if (!this.options.isDraggableRange) {
      this.handlers.push(
        new Handler(this.viewConnector.getHandlerContainer(this.slider), {
          id: 0,
          actions: this.actions,
          viewConnector: this.viewConnector,
          orientation: this.options.orientation,
          trigger: this.newTrigger,
          eventsForTrigger: this.customEvents,
        })
      )
    } else {
      const number = this.options.numberOfDraggableRanges * 2
      for (let i = 0; i < number; i++) {
        this.handlers.push(
          new Handler(this.viewConnector.getHandlerContainer(this.slider), {
            id: i,
            actions: this.actions,
            viewConnector: this.viewConnector,
            orientation: this.options.orientation,
            trigger: this.newTrigger,
            eventsForTrigger: this.customEvents,
          })
        )
      }
    }
  }

  private onMoveHandler = (handlerNumber: number, newPosition: number): void =>{
		if(handlerNumber === -1) {
			return;
		}
		const handler = this.handlers[handlerNumber];
		const oldPosition = handler.getPosition()
		handler.moveHandlerToPosition(Math.floor((newPosition-oldPosition)/this.stepsLength));	
	}
	private checkLimits = (position: number): number => {
		return 0
	}

	private setEndPositionAndStepLength(): void {
		const width = this.slider.getBoundingClientRect().width; 
		const heght = this.slider.getBoundingClientRect().height
		const valuesRange = (this.options.maxValue - this.options.minValue);
		if (this.options.orientation === Orientation.Horizontal) {
			this.endPosition = this.startPosition + width;
			this.stepsLength = width/valuesRange;
		}else {
			this.endPosition = this.startPosition + heght;
			this.stepsLength = heght/valuesRange;
		}
	}

  private newTrigger = (event: string, ...args: Array<Object>): void => {
    this.trigger(event, ...args)
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

export { Slider }
