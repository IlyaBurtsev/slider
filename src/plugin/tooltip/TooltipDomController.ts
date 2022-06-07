import { Orientation } from '../../models/Orientation';

export default class TooltipDomController {
  private tooltips: Array<HTMLElement>;
  private setValue: (tooltip: HTMLElement, value: string) => void;
  private convertPositionToValue: (position: number) => string;
  private parametrs: TooltipParametrs;
  private orientation: number;
  constructor(options: TooltipDomControllerOptions) {
    const { subscribeToChangeState, subscribeToTouchHandler, subscribeToStopMovingHandler } = options;
    this.init(options);
    subscribeToChangeState(this.onChangeState);
    subscribeToTouchHandler(this.onTouchHandler);
    subscribeToStopMovingHandler(this.onStopMovingHandler);
  }

  private init(options: TooltipDomControllerOptions) {
    const { numberOfTooltips, viewConnector, orientation, convertPositionToValue } = options;
    const { tooltip, setValueInTooltip } = viewConnector;
    if (tooltip === undefined) {
      return;
    }
    if (setValueInTooltip === undefined) {
      return;
    }
    this.convertPositionToValue = convertPositionToValue;
    this.setValue = setValueInTooltip;
    this.parametrs = this.getParametrs(tooltip, orientation);
    this.tooltips = initTooltips();

    function initTooltips(): Array<HTMLElement> {
      if (tooltip !== undefined) {
        tooltip.style.display = 'none';
        const elements: Array<HTMLElement> = [tooltip];
        if (numberOfTooltips > 1) {
          const fragment = document.createDocumentFragment();
          for (let i = 1; i < numberOfTooltips; i++) {
            const newTooltip = tooltip.cloneNode(true) as HTMLElement;
            fragment.append(newTooltip);
            elements.push(newTooltip);
          }
        }
        return elements;
      }
      return [];
    }
  }

  private getParametrs = (tooltip: HTMLElement, orientation: number): TooltipParametrs => {
    const cs = window.getComputedStyle(tooltip, null);
    let translate: number = 0;
    let display: string = cs.display;
    if (orientation === Orientation.Horizontal) {
      translate = Number(cs.left.match(/[-\d][0-9]+/));
    } else {
      translate = Number(cs.top.match(/[-\d][0-9]+/));
    }
    return {
      startTranslate: translate,
      display: display,
    };
  };

  private onChangeState = (state: State, id: number): void => {
    const tooltip = this.tooltips[id];
    const value = this.convertPositionToValue(state.position);
    this.setValue(tooltip, value);
  };

  private onTouchHandler = (id: number): void => {
    const { display } = this.parametrs;
    this.tooltips[id].style.display = display;
  };

  private onStopMovingHandler = (id: number): void => {
    this.tooltips[id].style.display = 'none';
  };

}
