/**
 * Lightweight allow-list HTML sanitizer for admin-authored rich content
 * (product descriptions, blogs, categories). Removes scripts, event handlers,
 * javascript: URLs and any iframe that is not a YouTube embed.
 */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'mark', 'sub', 'sup',
  'small', 'span', 'div', 'blockquote', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption', 'table', 'thead',
  'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col', 'iframe', 'label', 'input', 'section', 'article', 'details', 'summary',
]);

const ALLOWED_ATTRS = new Set([
  'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'loading', 'decoding', 'class', 'style', 'colspan', 'rowspan',
  'data-callout', 'data-type', 'data-checked', 'type', 'checked', 'disabled', 'allow', 'allowfullscreen', 'frameborder', 'start',
  'data-youtube-video', 'id', 'colwidth',
]);

const SAFE_URL = /^(https?:|mailto:|tel:|\/|#|data:image\/(png|jpe?g|gif|webp);base64,)/i;
const YOUTUBE = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\//i;
const SAFE_STYLE = /^(color|background-color|text-align|width|min-width|max-width|height):[^;]*$/i;

export const sanitizeHtml = (dirty = '') => {
  if (!dirty || typeof window === 'undefined' || typeof DOMParser === 'undefined') return dirty || '';
  const doc = new DOMParser().parseFromString(`<body>${dirty}</body>`, 'text/html');

  const walk = (node) => {
    [...node.children].forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        if (['script', 'style', 'object', 'embed', 'form', 'meta', 'link', 'base', 'svg', 'math'].includes(tag)) {
          el.remove();
        } else {
          el.replaceWith(...el.childNodes); // unwrap unknown tags, keep text
        }
        return;
      }
      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim();
        if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
          el.removeAttribute(attr.name);
          return;
        }
        if ((name === 'href' || name === 'src') && !SAFE_URL.test(value)) el.removeAttribute(attr.name);
        if (name === 'style') {
          const safe = value
            .split(';')
            .map((d) => d.trim())
            .filter((d) => d && SAFE_STYLE.test(d) && !/url\(|expression/i.test(d))
            .join('; ');
          if (safe) el.setAttribute('style', safe);
          else el.removeAttribute('style');
        }
      });
      if (tag === 'iframe' && !YOUTUBE.test(el.getAttribute('src') || '')) {
        el.remove();
        return;
      }
      if (tag === 'input' && el.getAttribute('type') !== 'checkbox') {
        el.remove();
        return;
      }
      if (tag === 'a' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener noreferrer');
      walk(el);
    });
  };
  walk(doc.body);
  return doc.body.innerHTML;
};

export default sanitizeHtml;
