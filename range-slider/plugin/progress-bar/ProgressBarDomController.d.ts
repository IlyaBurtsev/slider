import { BarDomControllerOptions } from '../../models/types';
export default class ProgressBarDomController {
    private bars;
    private orientation;
    private handlerLength;
    private numberOfHandlers;
    constructor(options: BarDomControllerOptions);
    private init;
    private onChangeState;
    private onDestroy;
    private updateBarView;
}
