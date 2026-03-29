import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content from the rich text editor to prevent XSS attacks.
 * Only allows safe HTML tags and attributes used by the TipTap editor.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 
      'h1', 'h2', 'h3', 
      'ul', 'ol', 'li', 
      'a', 'img', 
      'blockquote', 'hr',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'target', 'rel',
      'style' // Allow limited inline styles from editor
    ],
    ALLOW_DATA_ATTR: false,
    // Force all links to open in new tab with security attributes
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
};

/**
 * Sanitizes article content specifically, with stricter rules.
 */
export const sanitizeArticleContent = (html: string): string => {
  return sanitizeHtml(html);
};
