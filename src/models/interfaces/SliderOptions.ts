interface SliderOptions extends DataObject<OptionsType> {
  orientation: number
	isDraggableRange: boolean
  numberOfDraggableRanges: number
	minValue: number
	maxValue: number
	step: number
}