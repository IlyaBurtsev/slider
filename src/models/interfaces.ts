import { UserOptionsType } from './types';

/* eslint-disable no-unused-vars */
interface DataObject<T> {
  [id: string]: T;
}

interface UserOptions extends DataObject<UserOptionsType> {
  numberOfHandlers?: number;
  startValue?: number;
  endValue?: number;
  startValues?: Array<number> | number;
  step?: number;
  progressBar?: boolean;
  toolTips?: boolean;
  scale?: boolean;
  scaleStep?: number;
}

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

export { DataObject, UserOptions, SliderOptions };
