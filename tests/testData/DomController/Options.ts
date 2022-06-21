/**
 * @jest-environment jsdom
 */
/* eslint-disable no-unused-vars */
import { Actions, TooltipDomControllerOptions } from '../../../src/models/types';
import { ViewConnector } from '../../../src/models/ViewConnector';
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
  slider,
  handlerElement: handler,
  progressBar: bar,
  tooltip,
};

class Subscriber {
  public handler: Function;

  // eslint-disable-next-line no-shadow
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
  getEventNames,
  trigger,
  subscribeToChangeState: subscribeToMock,
  subscribeToTouchHandler: subscribeToMock,
  callback,
};

const handlerOptions = {
  viewConnector: view,
  orientation: 0,
  sliderLength: 1000,
  numberOfHandlers: 1,
  getEventNames,
  trigger,
  subscribeToChangeState: subscribeToMock,
  subscribeToDestroy: handlerDestroySubscriber.subscribe,
  callback,
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
