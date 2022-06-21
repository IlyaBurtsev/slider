/**
 * @jest-environment jsdom
 */

import PluginActions from '../src/models/enums/PluginActions';
import SliderDomController from '../src/plugin/slider/SliderDomController';
import { sliderOptions } from './testData/DomController/Options';

describe('SliderDomController', () => {
  test('Correct trigger should be called when mouse down on slider element (active events: start)', () => {
    // eslint-disable-next-line no-new
    new SliderDomController(sliderOptions);
    const sliderElement = sliderOptions.viewConnector.slider;
    const event = new Event('mousedown');
    sliderElement.dispatchEvent(event);
    const { trigger } = sliderOptions;
    expect(trigger.mock.calls[0][0]).toBe(PluginActions.onTouchSlider);
  });
});
