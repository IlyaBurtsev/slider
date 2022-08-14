import { HandlerDomControllerOptions, HandlerParametrs } from '../../models/types';
export default class HandlersDomController {
    private orientation;
    private handlerMinTranslate;
    private handlerListeners;
    private handlerElements;
    constructor(options: HandlerDomControllerOptions, callback: (parametrs: HandlerParametrs) => void);
    getHandlerElements: () => Array<HTMLElement>;
    private init;
    private addListeners;
    private onChachangeState;
    private onDestroy;
    private moveHandlerToPosition;
}
