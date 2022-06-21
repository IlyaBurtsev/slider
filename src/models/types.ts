/* eslint-disable no-unused-vars */
import { ViewConnector } from './ViewConnector';
import PluginActions from './enums/PluginActions';

type HandlerState = {
  position: number;
  minTranslate: number;
  maxTranslate: number;
};

type ValuesState = {
  values: Array<string>;
};

type RootState = {
  handlerStates: Array<HandlerState>;
  valuesState: ValuesState;
};

type OptionsType = number | boolean | Array<number>;

type UserOptionsType = number | boolean | Array<Array<number>> | Array<number> | undefined;

type SliderParametrs = {
  orientation: number;
  sliderLength: number;
  sliderStartPosition: number;
  sliderEndPosition: number;
};

type PaddingParametrs = {
  handlerMinTrahslate: number;
  handlerTop: number;
  handlerBottom: number;
  scaleSize: number;
};

type Actions = {
  start: string;
  move: string;
  end: string;
};

type SliderDomControllerOptions = {
  viewConnector: ViewConnector;
  getPaddingParametrs: () => PaddingParametrs;
  getEventNames: () => Actions;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void) => void;
  callback: (parametrs: SliderParametrs) => void;
};

type HandlerParametrs = {
  handlerLength: number;
  handlerMinTranslate: number;
  handlerMaxTranslate: number;
  handlerTop: number;
  handlerBottom: number;
};

type HandlerDomControllerOptions = {
  viewConnector: ViewConnector;
  orientation: number;
  sliderLength: number;
  numberOfHandlers: number;
  getEventNames: () => Actions;
  trigger: (actions: PluginActions, ...args: Array<Object>) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
};

type BarDomControllerOptions = {
  viewConnector: ViewConnector;
  orientation: number;
  numberOfHandlers: number;
  handlerLength: number;
  createProgressBar: boolean;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
};

type TooltipParametrs = {
  display: string;
};

type TooltipDomControllerOptions = {
  orientation: number;
  viewConnector: ViewConnector;
  handlerElements: Array<HTMLElement>;
  handlerBottom: number;
  createTooltips: boolean;
  subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
  subscribeToTouchHandler: (handler: (id?: number) => void, subscribe?: boolean) => void;
  subscribeToStopMovingHandler: (handler: (id?: number) => void) => void;
  subscribeToDestroy: (handler: () => void) => void;
};

type ScaleOptions = {
  orientation: number;
  numberOfSteps: number;
  scaleStep: number;
  sliderLength: number;
  handlerBottom: number;
  handlerTop: number;
  callback: (scaleSize: number) => void;
};

type BrowserEvent = MouseEvent & TouchEvent;

export {
  HandlerState,
  ValuesState,
  RootState,
  OptionsType,
  UserOptionsType,
  HandlerParametrs,
  SliderParametrs,
  HandlerDomControllerOptions,
  SliderDomControllerOptions,
  TooltipParametrs,
  TooltipDomControllerOptions,
  ScaleOptions,
  Actions,
  PaddingParametrs,
  BrowserEvent,
  BarDomControllerOptions,
};
