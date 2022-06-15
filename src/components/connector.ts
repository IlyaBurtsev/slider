import { getScale } from './scale/scale';
import { createSlider } from './slider/slider';
import { setValueInTooltip } from './tooltip/tooltip';

function getViewConnector(bindElement: HTMLElement | null): ViewConnector {
  if (bindElement === null) {
    throw new Error('Slider container is null!');
  }
  const elements: Array<HTMLElement> = createSlider(bindElement);
	const scale = getScale(bindElement)
  return {
    slider: elements[0],
    startHandlerElement: elements[1],
    progressBar: elements[2],
    tooltip: elements[3],
    setValueInTooltip: setValueInTooltip,
		scale: scale,
  };
}
export { getViewConnector };
