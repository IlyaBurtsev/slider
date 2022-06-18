/**
 * @jest-environment jsdom
 */
import { createElement } from '../../../src/plugin/utils/utils';
const paddingParametrs = jest.fn();

const getEventNames = (): Actions => {
  return {
    start: 'mousedown touchstart',
    move: 'mousemove touchmove',
    end: 'mouseup touchend',
  };
};

const slider = createElement({});
const handler = createElement({});
slider.append(handler);

const view: ViewConnector = {
  slider: slider,
  handlerElement: handler,
};
const trigger = jest.fn();
const subscribeToChenge = jest.fn();
const subscribeToTouch = jest.fn();
const callback = jest.fn();
const options = {
  viewConnector: view,
  getPaddingParametrs: paddingParametrs,
  getEventNames: getEventNames,
  trigger: trigger,
  subscribeToChangeState: subscribeToChenge,
  subscribeToTouchHandler: subscribeToTouch,
  callback: callback,
};

const handlerOptions = {
  viewConnector: view,
  orientation: 0,
  sliderLength: 1000,
  numberOfHandlers: 1,
  getEventNames: getEventNames,
  trigger: trigger,
  subscribeToChangeState: subscribeToChenge,
  subscribeToDestroy: subscribeToChenge,
};

export { options, handlerOptions };
