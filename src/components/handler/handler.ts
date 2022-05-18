import './handler.scss'
import { createElement } from "../../utils/utils"


const createHandler = (): HTMLElement => {
	const container = createElement({className: 'handler__container'});
	container.append(createElement({className: 'handler'}));
	return container;
}

export {createHandler}