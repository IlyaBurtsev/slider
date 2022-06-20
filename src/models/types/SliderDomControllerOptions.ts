/* eslint-disable no-unused-vars */
import ViewConnector from '../interfaces/ViewInterface/ViewConnector';
import PluginActions from '../PluginActions';
import PaddingParametrs from './BindElementPaddingParametrs';
import Actions from './HandlerActions';
import RootState from './RootState';
import SliderParametrs from './SliderParametrs';

type SliderDomControllerOptions = {
  viewConnector: ViewConnector;
  getPaddingParametrs: () => PaddingParametrs;
  getEventNames: () => Actions;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void) => void;
  callback: (parametrs: SliderParametrs) => void;
};

export default SliderDomControllerOptions;
