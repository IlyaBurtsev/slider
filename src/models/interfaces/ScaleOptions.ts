interface ScaleOptions {
  orientation: number;
  numberOfSteps: number;
  scaleStep: number;
  sliderLength: number;
  handlerBottom: number;
  handlerTop: number;
	callback: (scaleSize: number) => void;
}
