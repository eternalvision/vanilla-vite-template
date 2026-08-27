/**
 * Targeted DOM updates.
 *
 * The layout is rendered once. When state changes, re-render the smallest
 * region that owns it rather than the whole page — replacing markup discards
 * focus, caret position, and scroll state inside it.
 *
 * This is deliberately not a rendering framework: there is no diffing and no
 * reactivity. It covers a region small enough that replacing it is cheap. If an
 * app outgrows that, swap in a real renderer (see the README).
 */

/**
 * Replaces the contents of one element with rendered markup.
 *
 * @param {Element} target
 * @param {import('./html.js').RawHtml} markup
 * @returns {void}
 */
export const renderInto = (target, markup) => {
  target.innerHTML = markup.value;
};

/**
 * Reads the focus state worth restoring across a re-render. An element opts in
 * by carrying `data-focus-key`; anything else is not restored, because there is
 * no stable way to find it again.
 *
 * @param {Document | ShadowRoot} [scope]
 * @returns {{ key: string, start: number | null, end: number | null } | null}
 */
export const captureFocus = (scope = document) => {
  const active = scope.activeElement;

  if (!(active instanceof HTMLElement) || !active.dataset.focusKey) return null;

  const isTextField = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;

  return {
    key: active.dataset.focusKey,
    start: isTextField ? active.selectionStart : null,
    end: isTextField ? active.selectionEnd : null,
  };
};

/**
 * Puts focus (and the caret, for text fields) back on the element carrying the
 * captured key. A missing element is not an error — the region may have chosen
 * not to render it any more.
 *
 * @param {ParentNode} root
 * @param {ReturnType<typeof captureFocus>} focus
 * @returns {void}
 */
export const restoreFocus = (root, focus) => {
  if (!focus) return;

  const target = root.querySelector(`[data-focus-key="${CSS.escape(focus.key)}"]`);

  if (!(target instanceof HTMLElement)) return;

  target.focus();

  if (
    focus.start !== null &&
    (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
  ) {
    target.setSelectionRange(focus.start, focus.end);
  }
};

/**
 * Runs a DOM-replacing update with focus and caret preserved.
 *
 * @param {ParentNode} root scope to look the focused element up in afterwards
 * @param {() => void} update
 * @returns {void}
 */
export const withPreservedFocus = (root, update) => {
  const focus = captureFocus();

  update();
  restoreFocus(root, focus);
};
