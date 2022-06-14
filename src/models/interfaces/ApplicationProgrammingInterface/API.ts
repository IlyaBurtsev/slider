interface API {
	updateSliderOptions: (options: UserOptions) => void
	moveHandlerTo: (value: number, handlerIndex: number) => void
	subscribeToChangeState: (handler: (state?: RootState, id?: number) => void, subscribe?: boolean) =>void 
	subscribeToGetStarted: (handler: (id?: number) => void, subscribe?: boolean) => void
	subscribeToTheEndOfTheMovement: (handler: (id?: number) => void, subscribe?: boolean) => void
}