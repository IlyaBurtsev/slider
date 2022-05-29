import { Handler } from '../models/Handler'
import { Orientation } from '../models/Orientation'
import { HandlersDomController } from './handler/HandlersDomController'
import { Observer } from './observer/Observer'
import { deepMerge } from './utils/utils'

class Plugin extends Observer {
  private handlersDomController: HandlersDomController
  private handlers: Array<Handler> = []
  private options: SliderOptions
  private defaultOptions: SliderOptions = {
    orientation: Orientation.Horizontal,
    isDraggableRange: false,
    numberOfDraggableRanges: 1,
    minValue: 0,
    maxValue: 100,
    startPositions: [],
    step: 0.1,
  }

  constructor(viewConnector: ViewConnector, newOptions?: UserOptions) {
    super()
    this.updateOptions(newOptions)
    this.init()
    console.log(this.handlers)
  }
  private init(): void {
    this.initHandlers()
  }

  private updateOptions(newOptions?: UserOptions): void {
    if (newOptions) {
      this.options = deepMerge(this.defaultOptions, newOptions)
    } else {
      this.options = this.defaultOptions
    }
  }

  private initHandlers = () => {
    const { isDraggableRange, numberOfDraggableRanges, startPositions, minValue, maxValue } = this.options
    if (isDraggableRange) {
      let correctData: boolean = true
      let chancelPreviousInit = true
			let minPosition = minValue;
			let maxPosition = maxValue;
      if (startPositions.length === numberOfDraggableRanges) {
        chancelPreviousInit = false
        startPositions.forEach(pair => {
          if (pair.length === 2 && correctData) {
            pair.forEach(position => {
							if(position >= minPosition && position<= maxPosition) {
								const handler = new Handler();
								handler.setPosition(position)
								this.handlers.push(handler)
								minPosition = position;
							} else {
								correctData = false
							}			
						})
          } else {
            correctData = false
          }
        })
        if (!correctData) {
          this.handlers = [];
					chancelPreviousInit = true;
        } else {
					this.handlers.forEach((handler, id) => handler.setId(id));
				}
      }
      if (chancelPreviousInit) {
        for (let i = 0; i < (numberOfDraggableRanges * 2); i++) {
          this.handlers.push(new Handler(i))
        }
      }
    } else {
			let position = startPositions[0];
			const handler = new Handler(0);
			if(position !== undefined){
				if(position[0] >= minValue && position[0] <= maxValue) {
					handler.setPosition(position[0])
				}
			}
      this.handlers.push(handler)
    }
  }
}

export { Plugin }
