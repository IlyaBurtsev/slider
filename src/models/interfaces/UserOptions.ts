interface UserOptions extends DataObject<UserOptionsType> {
  numberOfHandlers?: number;
  sliderLimits?: Array<number>;
  startValues?:  Array<number> | number;
  step?: number;
}