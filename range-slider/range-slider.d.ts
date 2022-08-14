import API from './models/API';
import { ViewConnector } from './models/ViewConnector';
import { UserOptions } from './models/interfaces';
import getViewConnector from './components/connector';
declare const pluginCreator: {
    createSliderPlugin: (viewConnector: ViewConnector, options?: UserOptions | undefined) => API;
    getViewConnector: typeof getViewConnector;
    getScale: (sliderPlugin: HTMLElement) => import("./models/ViewConnector").ScaleElements;
};
export default pluginCreator;
