/**
 * Attaches an event listener to all DOM elements matching the given selector.
 *
 * @param {string} selector - CSS selector
 * @param {string} type - Event type (e.g. 'click', 'input')
 * @param {(event: Event, element: Element) => void} fn - Callback function
 * @param {{ preventDefault?: boolean }} [options={ preventDefault: false }]
 */
export default function addEventListener(selector, type, fn, options = { preventDefault: false }) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener(type, (event) => {
      if (options.preventDefault) {
        event.preventDefault();
      }
      fn(event, element);
    });
  });
}

export const on = addEventListener;

/**
 * Convenient click listener helper.
 *
 * @param {string} selector
 * @param {(event: MouseEvent, element: Element) => void} fn
 */
export function onClick(selector, fn) {
  addEventListener(selector, "click", fn, { preventDefault: true });
}
