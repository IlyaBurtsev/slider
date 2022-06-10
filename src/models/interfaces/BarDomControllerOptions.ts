interface BarDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  isDraggableRange: boolean;
  numberOfDraggableRanges: number;
  handlerLength: number;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
}
