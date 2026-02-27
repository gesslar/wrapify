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
const wrapify = (text = "", maxLineLength = 80, indent = 3) => {
  if(text === null || text === undefined || !text.length)
    return ""

  const parts = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n")

  let parseParagraphs = parts
    .reduce((result, part) => {
      const wrapped = wrapParagraph(part, maxLineLength, indent)

      return result + `\n${"".padStart(indent)}${wrapped}\n`
    }, "")

  while(parseParagraphs.startsWith("\n")) {
    parseParagraphs = parseParagraphs.substring(1)
  }

  while(parseParagraphs.endsWith("\n\n")) {
    parseParagraphs = parseParagraphs.substring(0, parseParagraphs.length - 1)
  }

  return parseParagraphs
}

const wrapParagraph = (text, maxLineLength, indent) => {
  const firstLineLength = maxLineLength - indent
  const remainingLinesLength = maxLineLength
  const words = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .join(" ")
    .replace(/\t/g, " ")
    .split(/\s+/)
    .filter(Boolean)

  let lineLength = 0
  let firstLineDone = false

  return words.reduce((result, word) => {
    const limit = firstLineDone ? remainingLinesLength : firstLineLength

    if(lineLength + word.length > limit) {
      firstLineDone = true
      lineLength = word.length

      return result + `\n${word}` // don't add spaces upfront
    }

    const separator = lineLength ? " " : ""
    lineLength += word.length + (lineLength ? 1 : 0)

    return result ? result + `${separator}${word}` : `${word}` // add space only when needed
  }, "")
}

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
const iwrapify = (text = "", maxLineLength = 80, indent = 4) => {
  if(text === null || text === undefined || !text.length)
    return ""

  const parts = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n")

  let parseParagraphs = parts
    .reduce((result, part) => {
      const wrapped = iwrapParagraph(part, maxLineLength, indent)

      return result + `\n${wrapped}\n`
    }, "")

  while(parseParagraphs.startsWith("\n")) {
    parseParagraphs = parseParagraphs.substring(1)
  }

  while(parseParagraphs.endsWith("\n\n")) {
    parseParagraphs = parseParagraphs.substring(0, parseParagraphs.length - 1)
  }

  return parseParagraphs
}

const iwrapParagraph = (text, maxLineLength, indent) => {
  const firstLineLength = maxLineLength
  const remainingLinesLength = maxLineLength - indent
  const words = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .join(" ")
    .replace(/\t/g, " ")
    .split(/\s+/)
    .filter(Boolean)

  let lineLength = 0
  let firstLineDone = false
  const wrapped = words.reduce((result, word) => {
    const limit = firstLineDone ? remainingLinesLength : firstLineLength

    if(lineLength + word.length > limit) {
      firstLineDone = true
      lineLength = word.length + indent

      return result + `\n${" ".repeat(indent)}${word}` // don't add spaces upfront
    }

    const separator = lineLength ? " " : ""
    lineLength += word.length + (lineLength ? 1 : 0)

    return result ? result + `${separator}${word}` : `${word}` // add space only when needed
  }, "")
  const wlines = wrapped.split("\n")
  if(wlines.length === 1)
    return wrapped

  for(let w = 1, szw = wlines.length; w < szw; w++) {
    wlines[w] = wlines[w].padStart(indent)
  }

  return wlines.join("\n")
}

export {
  wrapify,
  iwrapify
}

export default wrapify
