import { createElement } from '../../../plugin/utils/utils';

const createMarker = (bindElement: HTMLElement, markerType: MarkerType): HTMLElement => {
  return createElement({ className: markerType });
};

export { createMarker };
