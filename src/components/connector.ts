import { createSlider } from "./slider/slider";
import { setValueInTooltip } from "./tooltip/tooltip";

function getViewConnector (bindElement: HTMLElement): ViewConnector {
	const elements: Array<HTMLElement> = createSlider(bindElement);
	return {
		slider: elements[0],
		startHandlerElement: elements[1],
		progressBar: elements[2],
		tooltip: elements[3],
		setValueInTooltip: setValueInTooltip	
	}
}
export {getViewConnector}