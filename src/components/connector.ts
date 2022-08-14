import { ViewConnector } from '../models/ViewConnector';
import getScale from './scale/scale';
import createSlider from './slider/slider';
import { setValueInTooltip } from './tooltip/tooltip';

function getViewConnector(bindElement: HTMLElement | null): ViewConnector {
  if (bindElement === null) {
    throw new Error('Slider container is null!');
  }
	console.log(bindElement)
  const rect = bindElement.getBoundingClientRect();
  let isVertical = false;
  if (rect.height > rect.width) {
    isVertical = true;
  }
  const elements: Array<HTMLElement> = createSlider(bindElement, isVertical);
  return {
    slider: elements[0],
    handlerElement: elements[1],
    progressBar: elements[2],
    tooltip: elements[3],
    setValueInTooltip,
    scaleElements: getScale(elements[0]),
  };
}
export default getViewConnector;
