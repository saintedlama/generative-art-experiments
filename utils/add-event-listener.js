export default function addEventListener(selector, type, fn) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener(type, (event) => {
      event.preventDefault();
      fn(event);

      return false;
    });
  });
}