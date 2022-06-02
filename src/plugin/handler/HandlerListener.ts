import { Orientation } from '../../models/Orientation';
import { PluginActionsType } from '../../models/PluginActionsType';
import { removeEvent } from '../utils/utils';

export default class HandlerListener {
  private eventNames: HandlerActions;
  private handler: HTMLElement;
  private id: number;
  private orientation: number;
  private trigger: (actions: PluginActionsType, ...args: Array<Object>) => void;

  constructor(
    handler: HTMLElement,
    id: number,
    orientation: number,
    trigger: (actions: PluginActionsType, ...args: Array<Object>) => void
  ) {
    this.orientation = orientation;
    this.eventNames = this.prepareEventNames();
    this.handler = handler;
    this.id = id;
    this.trigger = trigger;
    this.bindEvents(handler);
  }

  private bindEvents(handler: HTMLElement): void {
    this.bindEvent(this.eventNames.start.split(' '), this.onTouchHandler, handler);
  }

  private onTouchHandler = (event: BrowserEvent): void => {
    event.stopPropagation();

    if (!this.checkTouch(event)) {
      return;
    }

    this.bindEvent(this.eventNames.move.split(' '), this.onMoveHandler, document.documentElement);
    this.bindEvent(this.eventNames.end.split(' '), this.onStopHandler, document.documentElement);
    this.trigger(PluginActionsType.onTouchHandler, this.id);
  };

  private onMoveHandler = (event: BrowserEvent): void => {
    const userPosition = this.getUsersHandlerPosition(event);
    this.trigger(PluginActionsType.onMoveHandler, this.handler, this.id, userPosition);
  };

  private onStopHandler = (): void => {
    removeEvent(this.eventNames.move.split(' '), this.onMoveHandler, document.documentElement);
    removeEvent(this.eventNames.end.split(' '), this.onStopHandler, document.documentElement);
    this.trigger(PluginActionsType.onStopMoving, this.id);
  };

  private bindEvent(
    events: Array<string>,
    listener: EventListener,
    element: HTMLElement,
    supportPassive?: boolean
  ): void {
    events.forEach((eventName) =>
      element.addEventListener(eventName, listener, supportPassive ? { passive: true } : false)
    );
  }

  private getUsersHandlerPosition = (event: BrowserEvent): number | boolean => {
    let x: number = 0;
    let y: number = 0;
    if (event.type.indexOf('touch') === 0) {
      const targetTouch = this.checkTouch(event);
      if (!targetTouch) {
        return false;
      }
      x = (targetTouch as Touch).pageX;
      y = (targetTouch as Touch).pageY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    if (this.orientation === Orientation.Horizontal) {
      return x;
    } else {
      return y;
    }
  };

  private checkTouch = (event: BrowserEvent): boolean | Touch => {
    if (event.type.indexOf('touch') === 0) {
      const touches = Array.prototype.filter.call(event.touches, this.isTouchOnTarget);

      // Do not support more than one touch per handle.
      if (touches.length > 1) {
        return false;
      } else {
        return touches[0];
      }
    } else {
      return true;
    }
  };

  private isTouchOnTarget = (event: BrowserEvent, currentTouch: Touch): boolean => {
    const target: HTMLElement = currentTouch.target as HTMLElement;

    return (
      target === this.handler ||
      this.handler.contains(target) ||
      (event.composed && event.composedPath().shift() === this.handler)
    );
  };

  private prepareEventNames(): HandlerActions {
    return (window.navigator as any).pointerEnabled
      ? {
          start: 'pointerdown',
          move: 'pointermove',
          end: 'pointerup',
        }
      : (window.navigator as any).msPointerEnabled
      ? {
          start: 'MSPointerDown',
          move: 'MSPointerMove',
          end: 'MSPointerUp',
        }
      : {
          start: 'mousedown touchstart',
          move: 'mousemove touchmove',
          end: 'mouseup touchend',
        };
  }
}
