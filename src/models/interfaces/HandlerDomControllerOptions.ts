import { PluginActions } from '../PluginActions';

export default interface HandlerDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  sliderLength: number;
  numberOfHandlers: number;
}
