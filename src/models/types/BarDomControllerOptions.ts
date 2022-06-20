/* eslint-disable no-unused-vars */
import ViewConnector from '../interfaces/ViewInterface/ViewConnector';
import RootState from './RootState';

type BarDomControllerOptions = {
  viewConnector: ViewConnector;
  orientation: number;
  numberOfHandlers: number;
  handlerLength: number;
  createProgressBar: boolean;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
};

export default BarDomControllerOptions;
