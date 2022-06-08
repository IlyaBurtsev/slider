interface TooltipDomControllerOptions {
  viewConnector: ViewConnector;
  handlerElements: Array<HTMLElement>;
  convertPositionToValue: (position: number) => string;
  subscribeToChangeState: (handler: (state?: State, id?: number) => void) => void;
	subscribeToTouchHandler: (handler: (id?: number) => void) => void;
	subscribeToStopMovingHandler: (handler: (id?: number) => void) => void;
}
