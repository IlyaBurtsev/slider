import { SliderDomControllerOptions } from '../../models/types';
export default class SliderDomController {
    private isInit;
    private sliderElement;
    private sliderHeight;
    private sliderListener;
    private getPaddingParametrs;
    private orientation;
    private callback;
    constructor(options: SliderDomControllerOptions);
    private onTouchHandler;
    private onChangeState;
    private getSliderParametrs;
    private setParentPaddings;
}
