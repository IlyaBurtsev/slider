import { ViewConnector } from './ViewConnector';
import PluginActions from './enums/PluginActions';
declare type HandlerState = {
    position: number;
    minTranslate: number;
    maxTranslate: number;
};
declare type ValuesState = {
    values: Array<string>;
};
declare type RootState = {
    handlerStates: Array<HandlerState>;
    valuesState: ValuesState;
};
declare type OptionsType = number | boolean | Array<number>;
declare type UserOptionsType = number | boolean | Array<Array<number>> | Array<number> | undefined;
declare type SliderParametrs = {
    orientation: number;
    sliderLength: number;
    sliderStartPosition: number;
    sliderEndPosition: number;
};
declare type PaddingParametrs = {
    handlerMinTrahslate: number;
    handlerTop: number;
    handlerBottom: number;
    scaleSize: number;
};
declare type Actions = {
    start: string;
    move: string;
    end: string;
};
declare type SliderDomControllerOptions = {
    viewConnector: ViewConnector;
    getPaddingParametrs: () => PaddingParametrs;
    getEventNames: () => Actions;
    trigger: (actions: PluginActions, ...args: Array<Object>) => void;
    subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
    subscribeToTouchHandler: (handler: (id?: number) => void) => void;
    callback: (parametrs: SliderParametrs) => void;
};
declare type HandlerParametrs = {
    handlerLength: number;
    handlerMinTranslate: number;
    handlerMaxTranslate: number;
    handlerTop: number;
    handlerBottom: number;
};
declare type HandlerDomControllerOptions = {
    viewConnector: ViewConnector;
    orientation: number;
    sliderLength: number;
    numberOfHandlers: number;
    getEventNames: () => Actions;
    trigger: (actions: PluginActions, ...args: Array<Object>) => void;
    subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
    subscribeToDestroy: (handler: () => void) => void;
};
declare type BarDomControllerOptions = {
    viewConnector: ViewConnector;
    orientation: number;
    numberOfHandlers: number;
    handlerLength: number;
    createProgressBar: boolean;
    subscribeToChangeState: (handler: (state?: RootState, id?: number) => void) => void;
    subscribeToDestroy: (handler: () => void) => void;
};
declare type TooltipParametrs = {
    display: string;
};
declare type TooltipDomControllerOptions = {
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
declare type ScaleOptions = {
    orientation: number;
    numberOfSteps: number;
    scaleStep: number;
    sliderLength: number;
    handlerBottom: number;
    handlerTop: number;
    callback: (scaleSize: number) => void;
};
declare type BrowserEvent = MouseEvent & TouchEvent;
export { HandlerState, ValuesState, RootState, OptionsType, UserOptionsType, HandlerParametrs, SliderParametrs, HandlerDomControllerOptions, SliderDomControllerOptions, TooltipParametrs, TooltipDomControllerOptions, ScaleOptions, Actions, PaddingParametrs, BrowserEvent, BarDomControllerOptions, };
