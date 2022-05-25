type OptionsType = number | boolean
type UserOptionsType = number | boolean | undefined

interface UserOptions extends DataObject<UserOptionsType> {
  orientation?: number
  isDraggableRange?: boolean
  numberOfDraggableRanges?: number
}

interface SliderOptions extends DataObject<OptionsType> {
  orientation: number
	isDraggableRange: boolean
  numberOfDraggableRanges: number
	minValue: number
	maxValue: number
	step: number
}
