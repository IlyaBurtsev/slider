interface API {
	updateSliderOptions: (options: UserOptions) => void
	onTouchHandler?: (handler: (id?: number) => void) => void
	onStopMovingHandler?: (handler: (id?: number) => void) => void
}