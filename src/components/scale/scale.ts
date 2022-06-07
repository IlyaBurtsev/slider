import { createElement } from '../../plugin/utils/utils';
import { createMarker } from './__marker/marker';
import { createValue } from './__value/value';

const createScale = (bindElement: HTMLElement): Scale => {
  const className = {
    scale: 'scale',
  };
  const scale = createElement({ className: className.scale });
  const markerLarge = createMarker(scale, MarkerType.Large);
  const markerDefault = createMarker(scale, MarkerType.Default);
	const value = createValue(scale)
  return {
		scale: scale,
		markerLarge: markerLarge,
		markerDefault: markerDefault,
		value: value
	};
};

export { createScale };