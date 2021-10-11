export const keyboardDriver = new (class KeyboardDriver {
	listeners: Record<string, (ev: KeyboardEvent) => void> = {}

	constructor() {
		document.addEventListener('keydown', (ev) => {
			this.listeners[ev.key]?.(ev)
		})
	}

	on(char: string, handler: (ev: KeyboardEvent) => void) {
		this.listeners[char] = handler
	}

	remove(char: string) {
		delete this.listeners[char]
	}

	clearListeners() {
		this.listeners = {}
	}
})()
