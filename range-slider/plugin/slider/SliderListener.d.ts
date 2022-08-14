import PluginActions from '../../models/enums/PluginActions';
import { Actions } from '../../models/types';
export default class SliderLisrener {
    private sliderElement;
    private orientation;
    private trigger;
    constructor(slider: HTMLElement, orientation: number, getEventNames: () => Actions, trigger: (actions: PluginActions, ...args: Array<Object>) => void);
    private onTouchSlider;
}
