/* eslint-disable no-unused-vars */
import DataObject from '../DataObject';
import ScaleElements from './ScaleElements';

interface ViewConnector extends DataObject<HTMLElement | Function | ScaleElements | undefined> {
  slider: HTMLElement;
  handlerElement: HTMLElement;
  progressBar?: HTMLElement;
  tooltip?: HTMLElement;
  setValueInTooltip?: (tooltip: HTMLElement, value: string) => void;
  scaleElements?: ScaleElements;
}

export default ViewConnector;
