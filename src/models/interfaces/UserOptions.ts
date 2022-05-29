interface UserOptions extends DataObject<UserOptionsType> {
  orientation?: number
  isDraggableRange?: boolean
  numberOfDraggableRanges?: number
	startValue?: number
	endValue?: number
	startPositions?:Array<Array<number>>
}