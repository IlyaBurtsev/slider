interface TooltipDomControllerOptions {
  viewConnector: ViewConnector;
  handlerElements: Array<HTMLElement>;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void) => void;
  subscribeToStopMovingHandler: (handler: (id?: number) => void) => void;
}
