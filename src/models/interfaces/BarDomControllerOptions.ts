interface BarDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  numberOfHandlers: number;
  handlerLength: number;
  createProgressBar: boolean;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
}
