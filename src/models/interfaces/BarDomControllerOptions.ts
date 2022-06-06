interface BarDomControllerOptions {
	viewConnector: ViewConnector;
  orientation: number;
	isDraggableRange: boolean;
  numberOfDraggableRanges: number;
	subscribeToChangeState: (handler: (state?: State, id?: number) => void) => void;
}