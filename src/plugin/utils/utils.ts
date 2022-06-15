import { Orientation } from '../../models/Orientation';

function deepMerge<T extends UserOptions>(target: T, allowAddOptions: boolean, ...objects: Array<UserOptions>): T {
  const keys: (keyof T)[] = Object.keys(target);
  objects
    .filter((o) => o)
    .forEach((obj) => {
      for (let [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          if (allowAddOptions) {
            target[key as keyof T] = value as T[keyof T];
          } else {
            if (keys.includes(key)) {
              target[key as keyof T] = value as T[keyof T];
            }
          }
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

function bindEvents(
  events: Array<string>,
  listener: EventListener,
  element: HTMLElement,
  supportPassive?: boolean
): void {
  events.forEach((eventName) =>
    element.addEventListener(eventName, listener, supportPassive ? { passive: true } : false)
  );
}

function removeEvents(events: Array<string>, listener: EventListener, element: HTMLElement): void {
  events.forEach((eventName) => element.removeEventListener(eventName, listener));
}

function removeElementsFromDom(elements: Array<HTMLElement>, startIndex: number): void {
  elements.forEach((element, index) => {
    if (index >= startIndex) {
      element.remove();
    }
  });
}

function getTouchPosition(event: BrowserEvent, targetElement: HTMLElement, orientation: number): number | boolean {
  let x: number = 0;
  let y: number = 0;
  if (event.type.indexOf('touch') === 0) {
    const targetTouch = checkTouch(event, targetElement);
    if (!targetTouch) {
      return false;
    }
    x = (targetTouch as Touch).pageX;
    y = (targetTouch as Touch).pageY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }
  if (orientation === Orientation.Horizontal) {
    return x;
  } else {
    return y;
  }
}

function checkTouch(event: BrowserEvent, targetElement: HTMLElement): boolean | Touch {
  if (event.type.indexOf('touch') === 0) {
    const touches = Array.prototype.filter.call(event.touches, isTouchOnTarget);

    // Do not support more than one touch per handle.
    if (touches.length > 1) {
      return false;
    } else {
      return touches[0];
    }
  } else {
    return true;
  }
}

function isTouchOnTarget(event: BrowserEvent, targetElement: HTMLElement, currentTouch: Touch): boolean {
  const target: HTMLElement = currentTouch.target as HTMLElement;

  return (
    target === targetElement ||
    targetElement.contains(target) ||
    (event.composed && event.composedPath().shift() === targetElement)
  );
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
  bindEvents,
  removeEvents,
  removeElementsFromDom,
  getTouchPosition,
	checkTouch
};
