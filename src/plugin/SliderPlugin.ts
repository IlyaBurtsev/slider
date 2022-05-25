import { bindEvent, deepMerge, removeEvent } from './utils/utils'
import { Handler } from './Handler'
import { Observer } from './observer/Observer'
import { Orientation } from '../models/Orientation'

class Slider extends Observer {
  private slider: HTMLElement
  private actions: Actions
  private handlers: Array<Handler> = []
	private handlerStartTranslate: number
	private hahdlerEndTranslate: number
	private sliderStartPosition: number
  private sliderEndPosition: number
  private stepsLength: number
  private options: SliderOptions
  private viewConnector: ViewConnector
  private defaultOptions: SliderOptions = {
    orientation: Orientation.Horizontal,
		isDraggableRange: false,
    numberOfDraggableRanges: 1,
    minValue: 0,
    maxValue: 100,
    step: 0.1,
  }
  private customEvents = {
    onTouchHandler: 'onTouchHandler',
    onMoveHandler: 'onMoveHandler',
    onStopMoving: 'onStopMoving',
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
		this.setSliderPosition(this.options.orientation);
    this.createHandlers();
		this.handlerStartTranslate = this.handlers[0].getHandlerTranslate();
    this.setEndPositionAndStepLength();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.on(this.customEvents.onTouchHandler, this.onTouchHandler)
  }

  private setSliderPosition(orientation: number): void {
    const rect = this.slider.getBoundingClientRect()
    if (orientation === Orientation.Horizontal) {
      this.sliderStartPosition = rect.left;
    } else {
      this.sliderStartPosition = rect.top;
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

  private onTouchHandler = (handlerId: number): void => {
    const handler = this.handlers[handlerId]
    this.on(this.customEvents.onMoveHandler, this.onMoveHandler)
    this.on(this.customEvents.onStopMoving, this.onStopMoving)
  }

  private onMoveHandler = (handlerId: number, newUserPosition: number): void => {
    if (handlerId === -1) {
      return
    }
    const handler = this.handlers[handlerId]
		const position = this.getHandlerPosition(newUserPosition, handler);	

		if (position){
			handler.moveHandlerToPosition(position);	
			handler.setCurrentPosition(position);
		}
  }

  private onStopMoving = (handlerId: number): void => {
    const handler = this.handlers[handlerId]

    this.off(this.customEvents.onMoveHandler, this.onMoveHandler)
    this.off(this.customEvents.onStopMoving, this.onStopMoving)
  }

  private getHandlerPosition = (newUserposition: number, handler: Handler): number | false => {
    const calcUserPosition = newUserposition - this.sliderStartPosition;
		if (isNaN(calcUserPosition)){
			return false
		}
		if (newUserposition <=this.sliderStartPosition) {
			return this.handlerStartTranslate
		}
		if (newUserposition > this.sliderEndPosition) {
			return this.hahdlerEndTranslate;
		}
		
		if(this.options.isDraggableRange){

		}
		let step: number =0;

		if (handler.getCurrentPosition() <= (calcUserPosition+ this.handlerStartTranslate)) {	
			step = Math.floor(Math.abs(calcUserPosition)/this.stepsLength);
		}else  {
			step =Math.ceil(Math.abs(calcUserPosition)/this.stepsLength);
		}
		if (step === 0) {
			return this.handlerStartTranslate
		}

		if (calcUserPosition<0){
			return -(step*this.stepsLength + this.handlerStartTranslate)
		}else {
			return step*this.stepsLength + this.handlerStartTranslate
		}
  }

  private setEndPositionAndStepLength(): void {
    const width = this.slider.getBoundingClientRect().width;
    const heght = this.slider.getBoundingClientRect().height;
    const valuesRange = this.options.maxValue - this.options.minValue;

    if (this.options.orientation === Orientation.Horizontal) {
      this.sliderEndPosition =this.sliderStartPosition + width;
			this.hahdlerEndTranslate = this.handlerStartTranslate + width;
      this.stepsLength = Number(((width / valuesRange) * this.options.step).toFixed(5));
    } else {
      this.sliderEndPosition = this.sliderStartPosition + heght;
			this.hahdlerEndTranslate = this.handlerStartTranslate + heght;
      this.stepsLength = Number(((heght / valuesRange) * this.options.step).toFixed(5));
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
