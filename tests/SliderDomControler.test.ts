/**
 * @jest-environment jsdom
 */

import { PluginActions } from "../src/models/PluginActions";
import SliderDomController from "../src/plugin/slider/SliderDomController";
import { options } from "./testData/SliderDomController/Options";

describe('SliderDomController', () => {

	test('Correct trigger should be called when mouse down on slider element (active events: start)', () => {
    new SliderDomController(options);
		const sliderElement = options.viewConnector.slider
		const event = new Event('mousedown')
		sliderElement.dispatchEvent(event)
		const trigger = options.trigger
		expect(trigger.mock.calls[0][0]).toBe(PluginActions.onTouchSlider)
  });

});