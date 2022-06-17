import { PluginActions } from '../PluginActions';

export interface SliderDomControllerOptions {
  viewConnector: ViewConnector;
  getPaddingParametrs: () => PaddingParametrs;
  getEventNames: () => Actions;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void) => void;
  callback: (parametrs: SliderParametrs) => void;
}
