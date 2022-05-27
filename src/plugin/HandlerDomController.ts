class HandlerDomController {
	private viewConnector: ViewConnector;
	private handlers: Array<Handler> = [];
	constructor(options: HandlerOptions) {
		const {numberOfHandlers, viewConnector} = options
		this.viewConnector = viewConnector;

	}
	private init(numberOfHandlers: number): void {
		for (let i = 0; i < numberOfHandlers; i++) {
			
		}
	}
}