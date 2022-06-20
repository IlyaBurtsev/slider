/* eslint-disable no-unused-vars */
import UserOptionsType from '../types/UserOptionsType';
import DataObject from './DataObject';

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

export default UserOptions;
