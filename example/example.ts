import './example.scss';
import '../src/components/slider/slider';

import { getElement } from '../src/plugin/utils/utils';

import { getViewConnector } from '../src/components/connector';
import Plugin from '../src/plugin/Plugin';
import { Orientation } from '../src/models/Orientation';

const sliderContainer = getElement('.slider');
if (sliderContainer) {
  new Plugin(getViewConnector(sliderContainer), {
		// orientation: Orientation.Vertical,
    isDraggableRange: true,
    numberOfDraggableRanges: 2,
    startValues: [[10, 30], [35,55]],
		step:0.1
  });
}
