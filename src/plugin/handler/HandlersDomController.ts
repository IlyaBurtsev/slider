import { Handler } from '../../models/Handler'
import { Orientation } from '../../models/Orientation'
import { Observer } from '../observer/Observer'
import { HandlerListener } from './HandlerListener'

class HandlersDomController extends Observer {
  private orientation: number
  private handlers: Array<Handler> = []
  private startHandlerLength: number
  private endHandlerLength: number | null
  private handlerMinTranslate: number
  private handlerMaxTranslate: number

	private customEvents = {
    onTouchHandler: 'onTouchHandler',
    onMoveHandler: 'onMoveHandler',
    onStopMoving: 'onStopMoving',
  }

  constructor(options: HandlerOptions) {
		super()
    this.init(options)
  }


  private init(options: HandlerOptions): void {
    const { position, orientation, trigger} = options;
    this.orientation = orientation;
    const handlerElements = this.createHandlersAndWriteParametrs(options);
    handlerElements.forEach((handler, id) => {
      this.prepareHandler(handler, id, position);
      new HandlerListener(handler, id, orientation, trigger, this.customEvents);
    })
  }

  private createHandlersAndWriteParametrs = (options: HandlerOptions): Array<HTMLElement> => {
		const handlers: Array<HTMLElement> = [];
    const { numberOfHandlers, viewConnector, orientation, sliderLength } = options
    const { startHandlerElement, endHandlerElement } = viewConnector
    if (!endHandlerElement) {
      for (let i = 0; i < numberOfHandlers; i++) {
        const newHandler = startHandlerElement.cloneNode(true) as HTMLElement
        handlers.push(newHandler)
      }
      this.writeHandlerParametrs(orientation, handlers[0], true, sliderLength)
    } else {
      let newHandler: HTMLElement
      for (let i = 0; i < numberOfHandlers; i++) {
        if (i % 2 === 0) {
          newHandler = startHandlerElement.cloneNode(true) as HTMLElement
        } else {
          newHandler = endHandlerElement.cloneNode(true) as HTMLElement
        }
        handlers.push(newHandler)
      }
      this.writeHandlerParametrs(orientation, handlers[1], true)
    }
		return handlers;
  }

  private prepareHandler = (handler: HTMLElement, id: number, position?: number): void => {
    this.setHandlerId(handler, id)
    if (position) {
      this.moveHandlerToPosition(handler, position)
    }
  }

	private moveHandlerToPosition = (handler: HTMLElement, newPosition: number): void => {
    if (this.orientation === Orientation.Horizontal) {
      handler.style.left = `${newPosition}px`
    } else {
      handler.style.top = `${newPosition}px`
    }
  }


  private setHandlerId(handler: HTMLElement, id: number): void {
    handler.setAttribute('handler-id', `${id}`)
  }

  private writeHandlerParametrs = (
    orientation: number,
    handler: HTMLElement,
    isFirstHandler: boolean,
    sliderLength?: number
  ): void => {
    const cs = window.getComputedStyle(handler, null)
    let length: number = 0
    let translate: number = 0
    if (orientation === Orientation.Horizontal) {
      translate = Number(cs.left.match(/[-\d][0-9]+/))
      length = Number(cs.width.match(/[-\d][0-9]+/))
    } else {
      length = Number(cs.height.match(/[-\d][0-9]+/))
      translate = Number(cs.top.match(/[-\d][0-9]+/))
    }

    if (isFirstHandler) {
      this.handlerMinTranslate = translate
      this.startHandlerLength = length
      if (sliderLength) {
        this.handlerMaxTranslate = translate + sliderLength
      }
    } else {
      this.endHandlerLength = length
      this.handlerMaxTranslate = translate
    }
  }

	// private onTouchHandler = (handlerId: number): void => {
  //   const handler = this.handlers[handlerId]
  //   this.on(this.customEvents.onMoveHandler, this.onMoveHandler)
  //   this.on(this.customEvents.onStopMoving, this.onStopMoving)
  // }

  // private onMoveHandler = (handlerId: number, newUserPosition: number): void => {
  //   if (handlerId === -1) {
  //     return
  //   }
  //   const handler = this.handlers[handlerId]
  //   const position = this.getHandlerPosition(newUserPosition, handler)

  //   if (position) {
  //     this.moveHandlerToPosition(position)
  //     handler.setCurrentPosition(position)
  //   }
  // }

  // private onStopMoving = (handlerId: number): void => {
  //   const handler = this.handlers[handlerId]

  //   this.off(this.customEvents.onMoveHandler, this.onMoveHandler)
  //   this.off(this.customEvents.onStopMoving, this.onStopMoving)
  // }

  // private getHandlerPosition = (newUserposition: number, handler: Handler): number | false => {
  //   const calcUserPosition = newUserposition - this.sliderStartPosition
  //   if (isNaN(calcUserPosition)) {
  //     return false
  //   }
  //   if (newUserposition <= this.sliderStartPosition) {
  //     return this.handlerStartTranslate
  //   }
  //   if (newUserposition > this.sliderEndPosition) {
  //     return this.hahdlerEndTranslate
  //   }

  //   if (this.options.isDraggableRange) {
  //   }
  //   let step: number = 0

  //   if (handler.getCurrentPosition() <= calcUserPosition + this.handlerStartTranslate) {
  //     step = Math.floor(Math.abs(calcUserPosition) / this.stepsLength)
  //   } else {
  //     step = Math.ceil(Math.abs(calcUserPosition) / this.stepsLength)
  //   }
  //   if (step === 0) {
  //     return this.handlerStartTranslate
  //   }

  //   if (calcUserPosition < 0) {
  //     return -(step * this.stepsLength + this.handlerStartTranslate)
  //   } else {
  //     return step * this.stepsLength + this.handlerStartTranslate
  //   }
  // }

  
}

export {HandlersDomController}
