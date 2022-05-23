
type methods = 'onMousemove'| 'onTouchmove'
class DocumentListener {
	private handler: HTMLElement;
	constructor (handler: HTMLElement) {
		this.handler = handler;
	}
	public listen(event: BrowserEvent):void {
		let method: keyof DocumentListener
		// method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
		method = this.getMethod(event)
    this[method](event);
	}
	public onMousemove(event: BrowserEvent): void {

	}

	public onTouchmove(event: BrowserEvent): void {

	}
	
	private getMethod(event: BrowserEvent):methods {
		return ('on' + event.type[0].toUpperCase() + event.type.slice(1)) as methods;
	}


}