export const activeElementIsInput = () =>
	['input', 'textarea'].includes(document.activeElement!.tagName.toLocaleLowerCase())
