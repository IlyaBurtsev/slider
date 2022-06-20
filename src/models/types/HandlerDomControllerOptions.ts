/* eslint-disable no-unused-vars */
import ViewConnector from '../interfaces/ViewInterface/ViewConnector';
import PluginActions from '../PluginActions';
import Actions from './HandlerActions';
import RootState from './RootState';

type HandlerDomControllerOptions = {
  viewConnector: ViewConnector;
  orientation: number;
  sliderLength: number;
  numberOfHandlers: number;
  getEventNames: () => Actions;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
};

export default HandlerDomControllerOptions;
