/**
 * @jest-environment jsdom
 */
import HandlerDomControllerOptions from '../../../src/models/interfaces/HandlerDomControllerOptions';
import { SliderDomControllerOptions } from '../../../src/models/interfaces/SliderDomControllerOptions';
import TooltipDomController from '../../../src/plugin/tooltip/TooltipDomController';
import { createElement } from '../../../src/plugin/utils/utils';
const paddingParametrs = jest.fn();

const getEventNames = (): Actions => {
  return {
    start: 'mousedown touchstart',
    move: 'mousemove touchmove',
    end: 'mouseup touchend',
  };
};

const slider = createElement({ className: 'slider' });
const handler = createElement({ className: 'handler' });
const bar = createElement({ className: 'bar' });
const tooltip = createElement({ className: 'tooltip' });
tooltip.style.display = 'block';
slider.append(handler);
slider.append(bar);
handler.append(tooltip);

const callback = jest.fn();
const trigger = jest.fn();
const setValueInTooltip = jest.fn();
const subscribeToMock = jest.fn();

const view: ViewConnector = {
  slider: slider,
  handlerElement: handler,
  progressBar: bar,
  tooltip: tooltip,
};

class Subscriber {
  public handler: Function;
  public subscribe = (callback: Function): void => {
    this.handler = callback;
  };

  public runCallback = (id?: number): void => {
		if (this.handler !== undefined) {
			if (id !== undefined) {
				this.handler(id);
			} else {
				this.handler();
			}
		}
    
  };
}

const handlerDestroySubscriber = new Subscriber();
const barDestroySubscriber = new Subscriber();
const tooltipSubscriber = {
  toDestroy: new Subscriber(),
  toTouchHandler: new Subscriber(),
  toStopMovingHandler: new Subscriber(),
};

const sliderOptions = {
  viewConnector: view,
  getPaddingParametrs: paddingParametrs,
  getEventNames: getEventNames,
  trigger: trigger,
  subscribeToChangeState: subscribeToMock,
  subscribeToTouchHandler: subscribeToMock,
  callback: callback,
};

const handlerOptions = {
  viewConnector: view,
  orientation: 0,
  sliderLength: 1000,
  numberOfHandlers: 1,
  getEventNames: getEventNames,
  trigger: trigger,
  subscribeToChangeState: subscribeToMock,
  subscribeToDestroy: handlerDestroySubscriber.subscribe,
  callback: callback,
};

const barOptions = {
  viewConnector: view,
  orientation: 0,
  numberOfHandlers: 1,
  handlerLength: 20,
  createProgressBar: true,
  subscribeToChangeState: subscribeToMock,
  subscribeToDestroy: barDestroySubscriber.subscribe,
};

const toolTipOptions: TooltipDomControllerOptions = {
  viewConnector: view,
  orientation: 0,
  handlerElements: [handler],
  handlerBottom: 0,
  createTooltips: true,
  subscribeToChangeState: subscribeToMock,
  subscribeToTouchHandler: tooltipSubscriber.toTouchHandler.subscribe,
  subscribeToStopMovingHandler: tooltipSubscriber.toStopMovingHandler.subscribe,
  subscribeToDestroy: tooltipSubscriber.toDestroy.subscribe,
};

export {
  sliderOptions,
  handlerOptions,
  handlerDestroySubscriber,
  barDestroySubscriber,
  barOptions,
  toolTipOptions,
  tooltipSubscriber,
};
