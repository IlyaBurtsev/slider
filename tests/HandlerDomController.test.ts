/**
 * @jest-environment jsdom
 */

import { PluginActions } from '../src/models/PluginActions';
import HandlersDomController from '../src/plugin/handler/HandlersDomController';
import SliderDomController from '../src/plugin/slider/SliderDomController';
import { handlerOptions, options } from './testData/SliderDomController/Options';

describe('HandlerDomController', () => {
  test('Trigger should be called when active events: start', () => {
    new HandlersDomController(handlerOptions, options.callback);
    const handlerElement = options.viewConnector.handlerElement;
    const event = new Event('mousedown');
    handlerElement.dispatchEvent(event);
    const trigger = options.trigger;
    expect(trigger.mock.calls[0][0]).toBe(PluginActions.onTouchHandler);
  });

  test('Trigger should be called when active events: move', () => {
    new HandlersDomController(handlerOptions, options.callback);
    const event = new Event('mousemove');
    document.documentElement.dispatchEvent(event);
    const trigger = options.trigger;
    expect(trigger.mock.calls[1][0]).toBe(PluginActions.onMoveHandler);
  });

  test('Trigger should be called when active events: stop', () => {
    new HandlersDomController(handlerOptions, options.callback);
    const event = new Event('mouseup');
    document.documentElement.dispatchEvent(event);
    const trigger = options.trigger;
    expect(trigger.mock.calls[2][0]).toBe(PluginActions.onStopMoving);
  });

  test('Trigger do not should be called when active events: move', () => {
    new HandlersDomController(handlerOptions, options.callback);
    const event = new Event('mousemove');
    document.documentElement.dispatchEvent(event);
    const trigger = options.trigger;
    expect(trigger.mock.calls.length).toBe(3);
  });

	test('Should be create correct number of handlers', () => {
		handlerOptions.numberOfHandlers = 4;
    new HandlersDomController(handlerOptions, options.callback);
    expect(options.viewConnector.slider.childNodes.length).toBe(4);
  });

	test('Should return taped handler id', () => {
    new HandlersDomController(handlerOptions, options.callback);
    const handlerElement = options.viewConnector.slider.childNodes[3];
    const event = new Event('mousedown');
    handlerElement.dispatchEvent(event);
    const trigger = options.trigger;
    expect(trigger.mock.calls[3][1]).toBe(3);
  });
});
