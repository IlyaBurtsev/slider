interface UserOptions extends DataObject<UserOptionsType> {
  numberOfHandlers?: number;
	startValue?: number;
  endValue?: number;
  startValues?:  Array<number> | number;
  step?: number;
}