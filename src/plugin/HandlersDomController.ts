import { Orientation } from '../models/Orientation'

class HandlersDomController {
  private orientation: number
  private handlers: Array<HTMLElement> = []
  private startHandlerLength: number
  private endHandlerLength: number | null
  private handlerMinTranslate: number
  private handlerMaxTranslate: number
  constructor(options: HandlerOptions) {
    const { numberOfHandlers, viewConnector, orientation, sliderLength } = options
    this.orientation = orientation
  }
  private init(numberOfHandlers: number, viewConnector: ViewConnector, sliderLength: number): void {
    const { startHandlerElement, endHandlerElement } = viewConnector
    if (!endHandlerElement) {
      for (let i = 0; i < numberOfHandlers; i++) {
        const newHandler = startHandlerElement.cloneNode(true) as HTMLElement
        this.setHandlerId(i, newHandler)
        this.handlers.push(newHandler)
      }
			this.writeHandlerParametrs(this.orientation, this.handlers[0], true, sliderLength)
    } else {
      let newHandler: HTMLElement
      for (let i = 0; i < numberOfHandlers; i++) {
        if (i % 2 === 0) {
          newHandler = startHandlerElement.cloneNode(true) as HTMLElement
        } else {
          newHandler = endHandlerElement.cloneNode(true) as HTMLElement
        }
        this.setHandlerId(i, newHandler)
        this.handlers.push(newHandler)
      }
			this.writeHandlerParametrs(this.orientation, this.handlers[1], true);
    }

  }

  private setHandlerId(id: number, handler: HTMLElement): void {
    handler.setAttribute('handler-id', `${id}`)
  }

  private prepareHandler = (handler: HTMLElement): void => {}

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
		
    if (isFirstHandler && sliderLength) {
			this.handlerMinTranslate = translate;
      this.startHandlerLength = length;
      this.handlerMaxTranslate = translate + sliderLength
    } else {
      this.endHandlerLength = length;
      this.handlerMaxTranslate = translate;
    }
  }
}
