import { UserOptionsType } from './types';
interface DataObject<T> {
    [id: string]: T;
}
interface UserOptions extends DataObject<UserOptionsType> {
    numberOfHandlers?: number;
    minValue?: number;
    maxValue?: number;
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
