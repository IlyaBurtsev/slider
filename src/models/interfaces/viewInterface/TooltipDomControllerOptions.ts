interface TooltipDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  numberOfTooltips: number;
  convertPositionToValue: (position: number) => string;
  subscribeToChangeState: (handler: (state?: State, id?: number) => void) => void;
	subscribeToTouchHandler: (handler: (id?: number) => void) => void;
	subscribeToStopMovingHandler: (handler: (id?: number) => void) => void;
}
