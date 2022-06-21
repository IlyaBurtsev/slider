import Orientation from '../../models/enums/Orientation';
import { RootState, TooltipDomControllerOptions, TooltipParametrs } from '../../models/types';

export default class TooltipDomController {
  private tooltips: Array<HTMLElement> = [];

  // eslint-disable-next-line no-unused-vars
  private setValue: (tooltip: HTMLElement, value: string) => void;

  private parametrs: TooltipParametrs;

  private primeTooltip: HTMLElement;

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
    this.primeTooltip = tooltip;

    this.parametrs = this.getParametrs();

    subscribeToDestroy(this.onDestroy);

    if (setValueInTooltip === undefined) {
      tooltip.style.display = 'none';
      return;
    }
    if (!createTooltips) {
      tooltip.style.display = 'none';
      return;
    }

    this.setValue = setValueInTooltip;

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

    this.tooltips = initTooltips();
    subscribeToChangeState(this.onChangeValues);
    subscribeToTouchHandler(this.onTouchHandler);
    subscribeToStopMovingHandler(this.onStopMovingHandler);
  }

  private getParametrs = (): TooltipParametrs => {
    const cs = window.getComputedStyle(this.primeTooltip, null);
    const { display } = cs;
    return {
      display,
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
    this.primeTooltip.style.display = `${display}`;
  };
}
