import { createSlider } from "./slider/slider";

function getViewConnector (bindElement: HTMLElement): ViewConnector {
	const elements: Array<HTMLElement | Scale> = createSlider(bindElement);
	return {
		slider: elements[0] as HTMLElement,
		startHandlerElement: elements[1] as HTMLElement,
		progressBar: elements[2] as HTMLElement,
		scaleElements: elements[3] as Scale
	}
}
export {getViewConnector}