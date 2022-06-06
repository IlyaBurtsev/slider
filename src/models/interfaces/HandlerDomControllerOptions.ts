import { PluginActionsType } from '../PluginActionsType';

export default interface HandlerDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  trigger: (actions: PluginActionsType, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: State, id?: number) => void) => void;
  sliderLength: number;
  numberOfHandlers: number;
}
