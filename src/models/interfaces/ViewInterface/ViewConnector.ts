interface ViewConnector extends DataObject<HTMLElement | Function | ScaleElements | undefined> {
  slider: HTMLElement;
  startHandlerElement: HTMLElement;
  progressBar?: HTMLElement;
  endHandlerElement?: HTMLElement;
  tooltip?: HTMLElement;
  setValueInTooltip?: (tooltip: HTMLElement, value: string) => void;
  scale?: ScaleElements;
}
