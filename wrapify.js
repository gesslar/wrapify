const wrapify = (text = "", maxLineLength = 80, indent = 3) => {
    if(text === null || text === undefined || !text.length) return "";

    const parts = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n");

    let parseParagraphs = parts
        .reduce((result, part) => {
            const wrapped = wrapParagraph(part, maxLineLength, indent);
            return result + `\n${"".padStart(indent)}${wrapped}\n`;
        }, "");

    while(parseParagraphs.startsWith("\n")) {
        parseParagraphs = parseParagraphs.substring(1);
    }

    while(parseParagraphs.endsWith("\n\n")) {
        parseParagraphs = parseParagraphs.substring(0, parseParagraphs.length - 1);
    }

    return parseParagraphs;
}; 
// wrapify modified from stolen answer at 
//https://codereview.stackexchange.com/questions/171832/text-wrapping-function-in-javascript
const wrapParagraph = (text, maxLineLength, indent) => {
    const firstLineLength = --maxLineLength - indent;
    const words = text
        .replace(/\r\n/g, "\n")
        .replace(/\n/g, "\n")
        .split("\n")
        .map(line => line.trim())
        .join("\n")
        .replace(/\n+/g, " ")
        .replace(/\t/g, " ")
        .split(" ");

    let lineLength = 0;
    let firstLineDone = false;
    return words.reduce((result, word) => {
        if(!firstLineDone) firstLineDone = true;
        if (lineLength + word.length >= (firstLineDone ? firstLineLength : maxLineLength)) {
            lineLength = word.length;
            return result + `\n${word}`; // don't add spaces upfront
        } else {
            lineLength += word.length + (result ? 1 : 0);
            return result ? result + ` ${word}` : `${word}`; // add space only when needed
        }
    }, "");
};

const iwrapify = (text = "", maxLineLength = 80, indent = 4) => {
    if(text === null || text === undefined || !text.length) return "";

    const parts = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n");

    let parseParagraphs = parts
        .reduce((result, part) => {
            const wrapped = iwrapParagraph(part, maxLineLength, indent);
            return result + `\n${wrapped}\n`;
        }, "");

    while(parseParagraphs.startsWith("\n")) {
        parseParagraphs = parseParagraphs.substring(1);
    }

    while(parseParagraphs.endsWith("\n\n")) {
        parseParagraphs = parseParagraphs.substring(0, parseParagraphs.length - 1);
    }

    return parseParagraphs;
}; 

const iwrapParagraph = (text, maxLineLength, indent) => {
    const firstLineLength = --maxLineLength;
    const remainingLinesLength = maxLineLength - indent;
    const words = text
        .replace(/\r\n/g, "\n")
        .replace(/\n/g, "\n")
        .split("\n")
        .map(line => line.trim())
        .join("\n")
        .replace(/\n+/g, " ")
        .replace(/\t/g, " ")
        .split(" ");

    let lineLength = 0;
    let firstLineDone = false;
    const wrapped = words.reduce((result, word) => {
        if(!firstLineDone) firstLineDone = true;
        if (lineLength + word.length >= (firstLineDone ? firstLineLength : remainingLinesLength)) {
            lineLength = word.length + indent;
            return result + `\n${" ".repeat(indent)}${word}`; // don't add spaces upfront
        } else {
            lineLength += word.length + (result ? 1 : 0);
            return result ? result + ` ${word}` : `${word}`; // add space only when needed
        }
    }, "");
    let wlines = wrapped.split("\n"), w, szw;
    if(wlines.length === 1) return wrapped;
    
    for(w = 1, szw = wlines.length; w < szw; w++) {
        wlines[w] = wlines[w].padStart(indent);
    }
    return wlines.join("\n");
}
