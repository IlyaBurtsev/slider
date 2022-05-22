interface ViewConnector {

	createSlider(bindElement: HTMLElement): HTMLElement,
	getHandlerContainer(slider: HTMLElement):HTMLElement,

	createHandler(bindElement: HTMLElement, handlerNumber: number): HTMLElement,
	getHandlerNumber(handler: HTMLElement):number,
	switchHandlerToActive?(handler: HTMLElement): void,
	switchHandlerToDisabled?(handler: HTMLElement): void

}