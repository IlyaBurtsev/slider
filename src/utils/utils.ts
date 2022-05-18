type mergeObject = {
	[id: string]: mergeObject;
}

export function deepMerge(target: mergeObject, ...objects: Array<mergeObject>): mergeObject {
	objects.filter(o => o).forEach((obj) => {
		for (let [key, value] of Object.entries(obj)) {
			let arrayOrObject = value !== undefined ? value.toString() === ('[object Object]' || '[object Array]') : false;

			if (arrayOrObject) {
				let targetType = target[key] !== undefined ? target[key].toString() : undefined,
					sourceType = value.toString(),
					initialValue = Array.isArray(value) ? [] : {};

				// If target and source types are different, e.g. we try to merge number with object,
				// then take source type
				target[key] = target[key]
					? targetType !== sourceType
						? initialValue
						: target[key]
					: initialValue;

				deepMerge(target[key], value);
			} else {
				target[key] = value;
			}
		}
	});

	return target;
}

export function getElement(el: string, context = document): HTMLElement |null {
  return context['querySelector'](el);
}

export function getElements(el: string, context = document): NodeList {
  return context['querySelectorAll'](el);
}

type attributes = {
	[id: string]: string;
}
type createParametrs = {
	tagName?: string,
  className?: string,
  innerHtml?: string,
  id?: string,
  attrs?:attributes
}
export function createElement(options:createParametrs): HTMLElement {
	const {tagName='div',className, innerHtml, id, attrs} = options
  let element = document.createElement(tagName);
  if (className) element.classList.add(...className.split(' '));
  if (id) element.id = id;

  if (innerHtml) {
    element.innerHTML = innerHtml;
  }

  if (attrs) {
		for (let attr in attrs) {
			element.setAttribute(attr, attrs[attr]);
		}
  }

  return element;
}

export function toggleClass(el: HTMLElement, ...classes: Array<string>): void {
  for (let className in classes) {
    if (!el.classList.contains(className)) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  }
}

export function addClass(el: Array<HTMLElement> | HTMLElement, ...classNames: Array<string>): void {
  if (el instanceof Array) {
		el.forEach((node) => {
			node.classList.add(...classNames);
		});
	} else {
		el.classList.add(...classNames);
	}
}

export function removeClass(el: Array<HTMLElement> | HTMLElement,...classNames: Array<string>): void {
  if (el instanceof Array) {
		el.forEach((node) => {
			node.classList.remove(...classNames);
		});
	} else {
		el.classList.remove(...classNames);
	}
}
