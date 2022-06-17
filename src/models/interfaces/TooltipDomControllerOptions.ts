interface TooltipDomControllerOptions {
  orientation: number;
  viewConnector: ViewConnector;
  handlerElements: Array<HTMLElement>;
	handlerBottom: number;
	createTooltips: boolean;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void, subscribe?: boolean) => void;
  subscribeToStopMovingHandler: (handler: (id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
}
