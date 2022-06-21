/**
 * @jest-environment jsdom
 */
/* eslint-disable no-shadow */
import PluginActions from '../src/models/enums/PluginActions';
import HandlersDomController from '../src/plugin/handler/HandlersDomController';
import { handlerOptions, handlerDestroySubscriber } from './testData/DomController/Options';

describe('HandlerDomController', () => {
  // eslint-disable-next-line no-unused-vars
  let controller = new HandlersDomController(handlerOptions, handlerOptions.callback);
  const { viewConnector, trigger } = handlerOptions;
  const { handlerElement } = viewConnector;
  test('Trigger should be called when active events: start', () => {
    const event = new Event('mousedown');
    handlerElement.dispatchEvent(event);
    expect(trigger.mock.calls[0][0]).toBe(PluginActions.onTouchHandler);
  });

  test('Trigger should be called when active events: move', () => {
    const event = new Event('mousemove');
    document.documentElement.dispatchEvent(event);
    expect(trigger.mock.calls[1][0]).toBe(PluginActions.onMoveHandler);
  });

  test('Trigger should be called when active events: stop', () => {
    const event = new Event('mouseup');
    document.documentElement.dispatchEvent(event);
    expect(trigger.mock.calls[2][0]).toBe(PluginActions.onStopMoving);
  });

  test('Trigger do not should be called when active events: move', () => {
    const event = new Event('mousemove');
    document.documentElement.dispatchEvent(event);
    expect(trigger.mock.calls.length).toBe(3);
  });

  test('Should create correct number of handlers in DOM', () => {
    handlerOptions.numberOfHandlers = 4;
    controller = new HandlersDomController(handlerOptions, handlerOptions.callback);
    const handlerElements = handlerOptions.viewConnector.slider.querySelectorAll('.handler');
    expect(handlerElements.length).toBe(4);
  });

  test('Should return taped handler id', () => {
    const { viewConnector, trigger } = handlerOptions;
    const handlerElement = viewConnector.slider.querySelectorAll('.handler')[3];
    const event = new Event('mousedown');
    handlerElement.dispatchEvent(event);
    expect(trigger.mock.calls[3][1]).toBe(3);
  });

  test('Should return single prime handler', () => {
    handlerDestroySubscriber.runCallback();
    const handlerElements = handlerOptions.viewConnector.slider.querySelectorAll('.handler');
    expect(handlerElements.length).toBe(1);
  });

  test('Should return correct number of handlers', () => {
    handlerOptions.numberOfHandlers = 2;
    controller = new HandlersDomController(handlerOptions, handlerOptions.callback);
    const handlerElements = handlerOptions.viewConnector.slider.querySelectorAll('.handler');
    expect(handlerElements.length).toBe(2);
  });
});
