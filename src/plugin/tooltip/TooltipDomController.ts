export default class TooltipDomController {
  private tooltips: Array<HTMLElement>;
  private setValue: (tooltip: HTMLElement, value: string) => void;
  private parametrs: TooltipParametrs;
  constructor(options: TooltipDomControllerOptions) {
    const {
      subscribeToChangeState: subscribeToChangeValues,
      subscribeToTouchHandler,
      subscribeToStopMovingHandler,
    } = options;
    this.init(options);
    subscribeToChangeValues(this.onChangeValues);
    subscribeToTouchHandler(this.onTouchHandler);
    subscribeToStopMovingHandler(this.onStopMovingHandler);
  }

  private init(options: TooltipDomControllerOptions) {
    const { handlerElements, viewConnector } = options;
    const { tooltip, setValueInTooltip } = viewConnector;
    if (tooltip === undefined) {
      return;
    }
    if (setValueInTooltip === undefined) {
      return;
    }
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

  private onChangeValues = (state: RootState): void => {
    this.tooltips.forEach((tooltip, id) => this.setValue(tooltip, state.valuesState.values[id]));
  };

  private onTouchHandler = (id: number): void => {
    const { display } = this.parametrs;
    this.tooltips[id].style.display = display;
  };

  private onStopMovingHandler = (id: number): void => {
    this.tooltips[id].style.display = 'none';
  };
}
