interface ViewConnector extends DataObject<HTMLElement | Function | ScaleElements | undefined> {
  slider: HTMLElement;
  handlerElement: HTMLElement;
  progressBar?: HTMLElement;
  tooltip?: HTMLElement;
  setValueInTooltip?: (tooltip: HTMLElement, value: string) => void;
  scaleElements?: ScaleElements;
}
