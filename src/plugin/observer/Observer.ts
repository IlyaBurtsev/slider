

class Observer {
  private events: Map<string, Set<Function>> = new Map();
  public on(eventName: string, handler: Function): void {
    if (!this.events.get(eventName)) {
			const set:Set<Function> = new Set()
      this.events.set(eventName, set.add(handler));
    } else {
      this.events.get(eventName)?.add(handler);
    }
  }
  public off(eventName: string, handler: Function): void {
		if (this.events.size ===0) return;
		if (!this.events.get(eventName)) return;

		this.events.get(eventName)?.delete(handler);
		
	}
  public removeAllEvents(): void {
		this.events.clear();
	}
  public trigger(eventName: string, ...args: Array<Object>) {
		if (this.events.size === 0) return;
		if (!this.events.get(eventName)) return;

		this.events.get(eventName)?.forEach(handler => {
			handler(...args);
		});
	}
}

export {Observer}
