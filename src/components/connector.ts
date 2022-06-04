import { createSlider } from "./slider/slider";

function getViewConnector (bindElement: HTMLElement): ViewConnector {
	const elements = createSlider(bindElement);
	return {
		slider: elements[0],
		startHandlerElement: elements[1],
		progressBar: elements[2]
	}
}
export {getViewConnector}