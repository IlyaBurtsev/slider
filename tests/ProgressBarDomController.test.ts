/**
 * @jest-environment jsdom
 */

import ProgressBarDomController from '../src/plugin/progress-bar/ProgressBarDomController';
import { barDestroySubscriber, barOptions } from './testData/DomController/Options';

describe('ProgressBarDomController', () => {
  // eslint-disable-next-line no-unused-vars
  let bar = new ProgressBarDomController(barOptions);
  test('Should return number of bars', () => {
    const barElements = barOptions.viewConnector.slider.querySelectorAll('.bar');
    expect(barElements.length).toBe(1);
  });

  test('Correct trigger should be called when mouse down on slider element (active events: start)', () => {
    barOptions.numberOfHandlers = 6;
    bar = new ProgressBarDomController(barOptions);
    const barElements = barOptions.viewConnector.slider.querySelectorAll('.bar');
    expect(barElements.length).toBe(3);
  });

  test('Should return single prime progress bar', () => {
    barDestroySubscriber.runCallback();
    const handlerElements = barOptions.viewConnector.slider.querySelectorAll('.bar');
    expect(handlerElements.length).toBe(1);
  });
});
