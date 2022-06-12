function deepMerge<T extends InitOptions>(target: T, ...objects: Array<InitOptions>): T {
  objects
    .filter((o) => o)
    .forEach((obj) => {
      for (let [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          target[key as keyof T] = value as T[keyof T];
        }
      }
    });
  return target;
}

function getElement(el: string, context = document.documentElement): HTMLElement | null {
  return context['querySelector'](el);
}

function getElements(el: string, context = document.documentElement): NodeList {
  return context['querySelectorAll'](el);
}

type createParametrs = {
  tagName?: string;
  className?: string;
  innerHtml?: string;
  id?: string;
  attrs?: DataObject<string>;
};

function createElement(options: createParametrs): HTMLElement {
  const { tagName = 'div', className, innerHtml, id, attrs } = options;
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

function toggleClass(el: HTMLElement, ...classes: Array<string>): void {
  for (let className in classes) {
    if (!el.classList.contains(className)) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  }
}

function hasClass(el: HTMLElement, ...classes: Array<string>): boolean {
  let result: boolean = false;
  for (let className in classes) {
    if (el.classList.contains(className)) {
      result = true;
    } else {
      result = false;
    }
  }
  return result;
}

function addClass(el: Array<HTMLElement> | HTMLElement, ...classNames: Array<string>): void {
  if (el instanceof Array) {
    el.forEach((node) => {
      node.classList.add(...classNames);
    });
  } else {
    el.classList.add(...classNames);
  }
}

function removeClass(el: Array<HTMLElement> | HTMLElement, ...classNames: Array<string>): void {
  if (el instanceof Array) {
    el.forEach((node) => {
      node.classList.remove(...classNames);
    });
  } else {
    el.classList.remove(...classNames);
  }
}

function removeEvent(events: Array<string>, listener: EventListener, element: HTMLElement): void {
  events.forEach((eventName) => element.removeEventListener(eventName, listener));
}

function removeElementsFromDom(elements: Array<HTMLElement>, startIndex: number): void {
  elements.forEach((element, index) => {
    if (index >= startIndex) {
      element.remove();
    }
  });
}

export {
  deepMerge,
  getElement,
  getElements,
  createElement,
  toggleClass,
  addClass,
  hasClass,
  removeClass,
  removeEvent,
  removeElementsFromDom,
};
