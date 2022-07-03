import './toggle.scss'

const className ={
	input:'js-toggle__input'
}

const getToggle = (bindElement: HTMLElement): HTMLInputElement => {
	return <HTMLInputElement>bindElement.querySelector(`.${className.input}`)
}

export {getToggle}