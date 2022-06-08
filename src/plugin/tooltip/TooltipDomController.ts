export default class TooltipDomController {
  private tooltips: Array<HTMLElement>;
  private setValue: (tooltip: HTMLElement, value: string) => void;
  private convertPositionToValue: (position: number) => string;
  private parametrs: TooltipParametrs;
  constructor(options: TooltipDomControllerOptions) {
    const { subscribeToChangeState, subscribeToTouchHandler, subscribeToStopMovingHandler } = options;
    this.init(options);
    subscribeToChangeState(this.onChangeState);
    subscribeToTouchHandler(this.onTouchHandler);
    subscribeToStopMovingHandler(this.onStopMovingHandler);
  }

  private init(options: TooltipDomControllerOptions) {
    const { handlerElements, viewConnector, convertPositionToValue } = options;
    const { tooltip, setValueInTooltip } = viewConnector;
    if (tooltip === undefined) {
      return;
    }
    if (setValueInTooltip === undefined) {
      return;
    }
    this.convertPositionToValue = convertPositionToValue;
    this.setValue = setValueInTooltip;
    this.parametrs = this.getParametrs(tooltip);
    this.tooltips = initTooltips();

    function initTooltips(): Array<HTMLElement> {
      const elements: Array<HTMLElement> = [];
      if (tooltip !== undefined) {
        tooltip.style.display = 'none';
        if (tooltip.parentElement === handlerElements[0]) {
          elements.push(tooltip);
          handlerElements.forEach((handler, index) => {
            if (index > 0) {
              const newTooltip = tooltip.cloneNode(true) as HTMLElement;
              handler.append(newTooltip);
              elements.push(newTooltip);
            }
          });
        }
      }
      return elements;
    }
  }

  private getParametrs = (tooltip: HTMLElement): TooltipParametrs => {
    const cs = window.getComputedStyle(tooltip, null);
    let display: string = cs.display;
    return {
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
