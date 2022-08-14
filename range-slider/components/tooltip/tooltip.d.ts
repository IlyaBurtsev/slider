import './tooltip.scss';
declare const createTooltip: (bindElement: HTMLElement) => HTMLElement;
declare const createTooltipVertical: (tooltip: HTMLElement) => void;
declare const setValueInTooltip: (tooltip: HTMLElement, value: string) => void;
export { createTooltip, setValueInTooltip, createTooltipVertical };
