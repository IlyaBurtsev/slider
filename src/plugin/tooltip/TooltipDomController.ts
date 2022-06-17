import { Orientation } from '../../models/Orientation';

export default class TooltipDomController {
  private tooltips: Array<HTMLElement> = [];
  private setValue: (tooltip: HTMLElement, value: string) => void;
  private parametrs: TooltipParametrs;
  constructor(options: TooltipDomControllerOptions) {
    this.init(options);
  }

  private init(options: TooltipDomControllerOptions) {
    const {
      orientation,
      handlerElements,
      handlerBottom,
      viewConnector,
      createTooltips,
      subscribeToChangeState,
      subscribeToTouchHandler,
      subscribeToStopMovingHandler,
      subscribeToDestroy,
    } = options;
    const { tooltip, setValueInTooltip } = viewConnector;
    if (tooltip === undefined) {
      return;
    }

    this.parametrs = this.getParametrs(tooltip);

    if (setValueInTooltip === undefined) {
      tooltip.style.display = 'none';
      return;
    }
    if (!createTooltips) {
      tooltip.style.display = 'none';
      return;
    }

    this.setValue = setValueInTooltip;

    this.tooltips = initTooltips();
    subscribeToChangeState(this.onChangeValues);
    subscribeToTouchHandler(this.onTouchHandler);
    subscribeToStopMovingHandler(this.onStopMovingHandler);
    subscribeToDestroy(this.onDestroy);

    function initTooltips(): Array<HTMLElement> {
      const elements: Array<HTMLElement> = [];
      if (tooltip !== undefined) {
        tooltip.style.display = 'none';
        if (tooltip.parentElement === handlerElements[0]) {
          if (orientation === Orientation.Vertical) {
            tooltip.style.left = `${handlerBottom + 5}px`;
          }
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

  private onDestroy = (): void => {
    const { display } = this.parametrs;
    this.tooltips[0].style.display = display;
  };
}
