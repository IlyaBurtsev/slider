import { PluginActions } from '../PluginActions';

export interface SliderDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  getEventNames: () => Actions;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void) => void;
  callback: (parametrs: SliderParametrs) => void;
}
