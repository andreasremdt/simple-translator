/**
 * Creates some HTML elements for the test runner to
 * run on.
 *
 * @param {String} h1Attributes
 * @param {String} pAttributes
 * @return {Object}
 */
export function buildHTML({ title, paragraph }) {
  const h1 = document.createElement('h1');
  const p = document.createElement('p');

  h1.setAttribute('data-i18n', title.keys);
  p.setAttribute('data-i18n', paragraph.keys);

  if (title.attrs) {
    h1.setAttribute('data-i18n-attr', title.attrs);
  }

  if (paragraph.attrs) {
    p.setAttribute('data-i18n-attr', paragraph.attrs);
  }

  h1.textContent = 'Default heading text';
  p.textContent = 'Default content text';

  document.body.appendChild(h1);
  document.body.appendChild(p);

  return { h1, p };
}

/**
 * Removes a list of HTML elements from the DOM.
 *
 * @param  {...HTMLElement} elements
 */
export function removeHTML(...elements) {
  elements.forEach((element) => document.body.removeChild(element));
}
