import { bindEvent, deepMerge, removeEvent } from './utils/utils'
import { Handler } from './Handler'
import { Observer } from './observer/Observer'
import { Orientation } from '../models/Orientation'

class Slider extends Observer {
  private slider: HTMLElement
  private actions: Actions
  private handlers: Array<Handler> = []
  private position: number
  private options: SliderOptions
  private viewConnector: ViewConnector
  private defaultOptions: Options = {
    orientation: Orientation.Horizontal,
    numberOfDraggableRanges: 1,
  }

  private customEvents = {
    onTouchHandler: 'onTouchHandler',
    onMoveHandler: 'onMoveHandler',
  }
  constructor(bindElement: HTMLElement | null, viewConnector: ViewConnector, newOptions?: Options) {
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

  private updateOptions(newOptions?: Options): void {
    let sliderOptions: MergeObject
    if (newOptions) {
      sliderOptions = deepMerge({}, this.defaultOptions, newOptions)
    } else {
      sliderOptions = this.defaultOptions
    }
    if (sliderOptions['orientation'] !== undefined) {
      if (sliderOptions['numberOfDraggableRanges'] !== undefined) {
        this.options = sliderOptions as SliderOptions
      }
    }
  }

  private createHandlers(): void {
    if (!this.options.isDraggableRange) {
      this.handlers.push(
        new Handler(this.viewConnector.getHandlerContainer(this.slider), {
          id: 1,
          actions: this.actions,
          viewConnector: this.viewConnector,
          orientation: this.options.orientation,
					trigger: this.newOnMoveTrigger,
        })
      )
    } else {
      const number = this.options.numberOfDraggableRanges * 2
      for (let i = 1; i <= number; i++) {
        this.handlers.push(
          new Handler(this.viewConnector.getHandlerContainer(this.slider), {
            id: i,
            actions: this.actions,
            viewConnector: this.viewConnector,
            orientation: this.options.orientation,
						trigger: this.newOnMoveTrigger,
          })
        )
      }
    }
  }

  private onMoveHandler(hadlerNumber: number, newPosition: number): void {}

  private newOnMoveTrigger = (handlerNumber: number, newPosition: number): void => {
    this.trigger(this.customEvents.onMoveHandler, handlerNumber, newPosition)
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
