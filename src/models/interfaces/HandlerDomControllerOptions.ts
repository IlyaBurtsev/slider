import { Handler } from '../Handler';
import { PluginActionsType } from '../PluginActionsType';

export default interface HandlerDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  trigger: (actions: PluginActionsType, ...args: Array<Object>) => void;
  sliderLength: number;
  handlers: Array<Handler>;
}
