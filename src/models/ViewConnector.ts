/* eslint-disable no-unused-vars */
import { DataObject } from './interfaces';

interface ScaleElements {
  scale: HTMLElement;
  markerLarge: HTMLElement;
  markerDefault: HTMLElement;
}

interface ViewConnector extends DataObject<HTMLElement | Function | ScaleElements | undefined> {
  slider: HTMLElement;
  handlerElement: HTMLElement;
  progressBar?: HTMLElement;
  tooltip?: HTMLElement;
  setValueInTooltip?: (tooltip: HTMLElement, value: string) => void;
  scaleElements?: ScaleElements;
}

export { ViewConnector, ScaleElements };
