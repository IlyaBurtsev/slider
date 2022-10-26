import ChangeStateTypes from './models/enums/ChangeStateTypes';
import API from './models/API';
import { ViewConnector } from './models/ViewConnector';
import { UserOptions } from './models/interfaces';
import getViewConnector from './components/connector';
declare const sliderCreator: {
    createSliderPlugin: (viewConnector: ViewConnector, options?: UserOptions | undefined) => API;
    ChangeStateTypes: typeof ChangeStateTypes;
    getViewConnector: typeof getViewConnector;
    getScale: (sliderPlugin: HTMLElement) => import("./models/ViewConnector").ScaleElements;
};
export default sliderCreator;
