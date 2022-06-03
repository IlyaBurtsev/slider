import './example.scss';
import '../src/components/slider/slider';

import { getElement } from '../src/plugin/utils/utils';

import { getViewConnector } from '../src/components/connector';
import Plugin from '../src/plugin/Plugin';

const sliderContainer = getElement('.slider');
if (sliderContainer) {
  new Plugin(getViewConnector(sliderContainer), {
    isDraggableRange: false,
    numberOfDraggableRanges: 1,
    startValues: 50,
  });
}
