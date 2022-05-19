
class Handler {
  private element: HTMLElement;
  private position: number = 0;
	
  constructor(handlerElement: HTMLElement) {
    this.element = handlerElement
  }

	public getHandler(): HTMLElement {
		return this.element;
	}
	protected setPosition(position: number): void {
		this.position = position;
	}

	protected getPosition(): number {
		return this.position;
	}
}

