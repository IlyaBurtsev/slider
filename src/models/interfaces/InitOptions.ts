interface InitOptions extends DataObject<UserOptionsType> {
  orientation?: number;
  numberOfHandlers?: number;
  startValue?: number;
  endValue?: number;
  startValues?:  Array<number> | number;
  step?: number;
}
