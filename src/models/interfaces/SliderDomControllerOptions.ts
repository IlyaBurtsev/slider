interface SliderDomControllerOptions {
	viewConnector: ViewConnector
	orientation: number
	subscribeToTouchHandler: (handler: (id?: number) => void) => void;
	callback: (parametrs: SliderParametrs) => void
}