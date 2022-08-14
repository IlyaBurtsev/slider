import { ScaleOptions } from '../../models/types';
import { ViewConnector } from '../../models/ViewConnector';
export default class ScaleCreator {
    private markersElements;
    private scaleSize;
    constructor(viewConnector: ViewConnector, options: ScaleOptions, subscribeToDestroy: (handler: () => void) => void);
    private createScale;
    private onDestroy;
}
