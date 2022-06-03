interface UserOptions extends DataObject<UserOptionsType> {
  orientation?: number
  isDraggableRange?: boolean
  numberOfDraggableRanges?: number
	startValue?: number
	endValue?: number
	startValues?:Array<Array<number>> | Array<number> | number
	step?: number
}