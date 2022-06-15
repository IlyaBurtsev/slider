interface SliderOptions extends UserOptions {
  numberOfHandlers: number;
  minValue: number;
  maxValue: number;
  step: number;
  startValues: Array<number> | number;
	progressBar: boolean;
	toolTips: boolean;
	scale: boolean;
	scaleStep: number;
}
