import './scale.scss';
import { addClass, createElement } from '../../plugin/utils/utils';
import MarkerType from './Classes/MarkerType';
import createMarker from './__marker/marker';
import { ScaleElements } from '../../models/ViewConnector';

const getScale = (sliderPlugin: HTMLElement): ScaleElements => {
  const className = {
    scale: 'scale',
    scaleVertical: 'scale_vertical',
  };

  const rect = sliderPlugin.getBoundingClientRect();
  const scale = createElement({ className: className.scale });
  const markerLarge = createMarker(MarkerType.Large);
  const markerDefault = createMarker(MarkerType.Default);

  if (rect.height > rect.width) {
    addClass(scale, className.scaleVertical);
  }
  sliderPlugin.append(scale);
  return {
    scale,
    markerLarge,
    markerDefault,
  };
};

export default getScale;
