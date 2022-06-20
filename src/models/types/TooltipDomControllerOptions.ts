import ViewConnector from '../interfaces/ViewInterface/ViewConnector';
import RootState from './RootState';

/* eslint-disable no-unused-vars */
type TooltipDomControllerOptions = {
  orientation: number;
  viewConnector: ViewConnector;
  handlerElements: Array<HTMLElement>;
  handlerBottom: number;
  createTooltips: boolean;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void, subscribe?: boolean) => void;
  subscribeToStopMovingHandler: (handler: (id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
};

export default TooltipDomControllerOptions;
