/**
 * @jest-environment jsdom
 */

import TooltipDomController from '../src/plugin/tooltip/TooltipDomController';
import { toolTipOptions, tooltipSubscriber } from './testData/DomController/Options';

describe('TooltipDomController', () => {
  // eslint-disable-next-line no-unused-vars
  let tooltip = new TooltipDomController(toolTipOptions);

  test('Tooltip property "display" should to be always "none" when no method setValueInTooltip', () => {
    tooltipSubscriber.toTouchHandler.runCallback(0);
    const tooltipElement = toolTipOptions.viewConnector.slider.querySelectorAll('.tooltip')[0] as HTMLElement;
    expect(tooltipElement.style.display).toBe('none');
  });

  test('Should return single prime tooltip witn default property "display"', () => {
    tooltipSubscriber.toDestroy.runCallback();
    const tooltipElement = toolTipOptions.viewConnector.slider.querySelectorAll('.tooltip')[0] as HTMLElement;
    expect(tooltipElement.style.display).toBe('block');
  });

  test('Tooltip property "display" should to be "none" when initialisation', () => {
    toolTipOptions.viewConnector.setValueInTooltip = jest.fn();
    tooltip = new TooltipDomController(toolTipOptions);
    const tooltipElement = toolTipOptions.viewConnector.slider.querySelectorAll('.tooltip')[0] as HTMLElement;
    expect(tooltipElement.style.display).toBe('none');
  });

  test('Should return number of bars', () => {
    const tooltipElements = toolTipOptions.viewConnector.slider.querySelectorAll('.tooltip');
    expect(tooltipElements.length).toBe(1);
  });

  test('Tooltip property "display" should to be default property when touch on handler (in that case "block")', () => {
    tooltipSubscriber.toTouchHandler.runCallback(0);
    const tooltipElement = toolTipOptions.viewConnector.slider.querySelectorAll('.tooltip')[0] as HTMLElement;
    expect(tooltipElement.style.display).toBe('block');
  });

  test('Tooltip property "display" should to be "none" after stop moving handler', () => {
    tooltipSubscriber.toStopMovingHandler.runCallback(0);
    const tooltipElement = toolTipOptions.viewConnector.slider.querySelectorAll('.tooltip')[0] as HTMLElement;
    expect(tooltipElement.style.display).toBe('none');
  });
});
