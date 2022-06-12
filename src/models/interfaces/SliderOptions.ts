interface SliderOptions extends InitOptions{
  orientation: number;
  numberOfHandlers: number;
  minValue: number;
  maxValue: number;
  step: number;
  startValues: Array<number> | number;
}
