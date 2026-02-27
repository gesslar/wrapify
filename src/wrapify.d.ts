export default wrapify;
/**
 * Wraps text to a maximum line length, indenting the first line of each
 * paragraph by the specified amount.
 *
 * @param {string} [text=""] - The text to wrap.
 * @param {number} [maxLineLength=80] - The maximum length of each line.
 * @param {number} [indent=3] - The number of spaces to indent the first line
 *   of each paragraph.
 * @returns {string} The wrapped text.
 */
export function wrapify(text?: string, maxLineLength?: number, indent?: number): string;
/**
 * Wraps text to a maximum line length, indenting continuation lines
 * (all lines after the first) of each paragraph by the specified amount.
 *
 * @param {string} [text=""] - The text to wrap.
 * @param {number} [maxLineLength=80] - The maximum length of each line.
 * @param {number} [indent=4] - The number of spaces to indent continuation
 *   lines.
 * @returns {string} The wrapped text.
 */
export function iwrapify(text?: string, maxLineLength?: number, indent?: number): string;
//# sourceMappingURL=wrapify.d.ts.map