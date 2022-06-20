import { createElement } from '../../../plugin/utils/utils';
import MarkerType from '../Classes/MarkerType';

const createMarker = (markerType: MarkerType): HTMLElement => {
  return createElement({ className: markerType });
};

export default createMarker;
