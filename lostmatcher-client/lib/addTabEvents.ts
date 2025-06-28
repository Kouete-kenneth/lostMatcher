// Simple event emitter for add tab presses
class SimpleEventEmitter {
	private listeners: { [event: string]: Function[] } = {};

	on(event: string, listener: Function) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	}

	off(event: string, listener: Function) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter(
			(l) => l !== listener
		);
	}

	emit(event: string, ...args: any[]) {
		if (!this.listeners[event]) return;
		this.listeners[event].forEach((listener) => listener(...args));
	}
}

export const addTabEvents = new SimpleEventEmitter();
export const ADD_TAB_PRESSED = "addTabPressed";
