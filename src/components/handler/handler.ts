import './handler.scss'
import { createElement } from '../../plugin/utils/utils'

const createHandler = (bindElement: HTMLElement): HTMLElement => {
	const className = {
		handler: 'handler',
	}

  const handler = createElement({ className: className.handler})
  bindElement.append(handler)
  return handler
}

export { createHandler }
