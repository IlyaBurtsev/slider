import { PluginActions } from '../PluginActions';

export default interface HandlerDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: State, id?: number) => void) => void;
  sliderLength: number;
  numberOfHandlers: number;
}
