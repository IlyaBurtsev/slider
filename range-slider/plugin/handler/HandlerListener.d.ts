import PluginActions from '../../models/enums/PluginActions';
import { Actions } from '../../models/types';
export default class HandlerListener {
    private eventNames;
    private handler;
    private id;
    private orientation;
    private trigger;
    constructor(handler: HTMLElement, id: number, orientation: number, getEventNames: () => Actions, trigger: (actions: PluginActions, ...args: Array<Object>) => void);
    private onTouchHandler;
    private onMoveHandler;
    private onStopHandler;
}
