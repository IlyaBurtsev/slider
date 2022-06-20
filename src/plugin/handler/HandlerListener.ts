import PluginActions from '../../models/PluginActions';
import BrowserEvent from '../../models/types/BrouserEvent';
import Actions from '../../models/types/HandlerActions';
import { bindEvents, checkTouch, getTouchPosition, removeEvents } from '../utils/utils';

export default class HandlerListener {
  private eventNames: () => Actions;

  private handler: HTMLElement;

  private id: number;

  private orientation: number;

  private trigger: (actions: PluginActions, ...args: Array<Object>) => void;

  constructor(
    handler: HTMLElement,
    id: number,
    orientation: number,
    getEventNames: () => Actions,
    trigger: (actions: PluginActions, ...args: Array<Object>) => void,
  ) {
    this.orientation = orientation;
    this.eventNames = getEventNames;
    this.handler = handler;
    this.id = id;
    this.trigger = trigger;
    bindEvents(this.eventNames().start.split(' '), this.onTouchHandler, handler);
  }

  private onTouchHandler = (event: BrowserEvent): void => {
    event.stopPropagation();
    if (!checkTouch(event, this.handler)) {
      return;
    }
    bindEvents(this.eventNames().move.split(' '), this.onMoveHandler, document.documentElement);
    bindEvents(this.eventNames().end.split(' '), this.onStopHandler, document.documentElement);
    this.trigger(PluginActions.onTouchHandler, this.id);
  };

  private onMoveHandler = (event: BrowserEvent): void => {
    const userPosition = getTouchPosition(event, this.handler, this.orientation);
    this.trigger(PluginActions.onMoveHandler, userPosition, this.id);
  };

  private onStopHandler = (): void => {
    removeEvents(this.eventNames().move.split(' '), this.onMoveHandler, document.documentElement);
    removeEvents(this.eventNames().end.split(' '), this.onStopHandler, document.documentElement);
    this.trigger(PluginActions.onStopMoving, this.id);
  };
}
