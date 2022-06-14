import { PluginActions } from '../PluginActions';

export default interface HandlerDomControllerOptions {
  viewConnector: ViewConnector;
  orientation: number;
  sliderLength: number;
  numberOfHandlers: number;
	getEventNames: () => Actions;
	trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
	subscribeToDestroy: (handler: () => void) => void;
}
