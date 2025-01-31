import {
  fetchPlaceholders,
} from '../../scripts/scripts.js';

/**
 * Creates an SVG tag using the specified ID.
 * @param {string} id The ID
 * @returns {element} The SVG tag
 */
function createSVG(id) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `/icons/icons.svg#${id}`);
  svg.appendChild(use);
  return svg;
}

/**
 * Returns social link details based on the specified URL.
 * @param {string} url The social URL
 * @returns {object} The social link details
 */
function getSocialLinkDetails(url) {
  let title;
  [
    'Twitter',
    'LinkedIn',
    'Facebook',
    'YouTube',
    'Instagram',
  ].forEach((t) => {
    if (!title && url.indexOf(t.toLowerCase()) > 0) {
      title = t;
    }
  });
  if (!title && url.includes('@')) {
    title = 'Email';
  }
  if (!title) title = 'Unknown';
  const type = title.toLowerCase();
  return {
    title,
    type,
    className: `social-${type}`,
  };
}

/**
 * Decorates social links.
 * @param {Element} blockEl The block element
 */
export default async function decorateSocialLinks(blockEl) {
  blockEl.querySelectorAll(':scope a').forEach((linkEl) => {
    const { title, type, className } = getSocialLinkDetails(linkEl.href);
    if (type === 'unknown') {
      // remove links with unknown type
      linkEl.remove();
      return;
    }
    if (type === 'email') {
      linkEl.setAttribute('title', title);
      linkEl.href = `mailto:${linkEl.textContent}`;
      linkEl.className = className;
      return;
    }
    linkEl.innerHTML = '';
    linkEl.appendChild(createSVG(type));
    linkEl.setAttribute('title', title);
    linkEl.className = className;
  });
  const ul = blockEl.querySelector('ul');
  if (ul.hasChildNodes()) {
    // add language specific text
    const parent = ul.parentNode;
    const placeholders = await fetchPlaceholders();
    const followMe = document.createElement('p');
    followMe.classList.add('social-links-text');
    followMe.textContent = placeholders.social;
    parent.prepend(followMe);
  }
}
