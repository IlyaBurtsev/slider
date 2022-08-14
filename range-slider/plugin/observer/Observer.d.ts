declare class Observer {
    private events;
    on(eventName: string, handler: Function): void;
    off(eventName: string, handler: Function): void;
    removeAllEvents(): void;
    trigger(eventName: string, ...args: Array<Object>): void;
}
export default Observer;
