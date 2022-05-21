import { createHandler, isHandlerDisabled, switchHandlerToActive } from '../components/handler/handler'
import { bindEvent, deepMerge, removeEvent } from './utils/utils'
import { Handler } from './Handler'
import { Observer } from './observer/Observer'
import { createSlider, getHandlerContainer } from '../components/slider/slider'
import { Orientation } from '../models/Orientation'

class Slider extends Observer {
  private slider: HTMLElement
  private actions: Actions
  private handlers: Array<Handler> = []
  private position: number
  private options: SliderOptions
  private defaultOptions: Options = {
    orientation: Orientation.Horizontal,
		numberOfDraggableRanges:1
  }

  private customEvents = {
    onTouchHandler: 'onTouchHandler',
  }
  constructor(bindElement: HTMLElement | null, newOptions?: Options) {
    super()
    if (!bindElement) {
      return
    }
    this.slider = createSlider(bindElement);
		this.updateOptions(newOptions);

    this.init()
  }

  private init(): void {
    this.actions = this.prepareEventNames()
    this.position = this.getPosition(this.options.orientation)
    this.createHandlers()
  }

  private bindEvents(): void {}

  private getPosition(orientation: number): number {
    const rect = this.slider.getBoundingClientRect()
    if (orientation === Orientation.Horizontal) {
      return rect.left
    } else {
      return rect.top
    }
  }

	private updateOptions (newOptions?: Options):void {
		let sliderOptions: MergeObject
		if (newOptions) {
      sliderOptions = deepMerge({}, this.defaultOptions, newOptions)
    } else {
			sliderOptions = this.defaultOptions;
		}
		if (sliderOptions['orientation'] !== undefined) {
			if (sliderOptions['numberOfDraggableRanges'] !== undefined) {
				this.options = sliderOptions as SliderOptions
			}     
		}
	}

  private createHandlers(): void {
    if (!this.options.isDraggableRange) {
      this.handlers.push(new Handler(getHandlerContainer(this.slider), 1, this.actions))
    } else {
			const number = this.options.numberOfDraggableRanges*2
      for (let i = 1; i <= number; i++) {
        this.handlers.push(new Handler(getHandlerContainer(this.slider), i, this.actions))
      }
    }
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

export { Slider }
