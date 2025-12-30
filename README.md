# @gesslar/wrapify

Lightweight helpers for wrapping multi-paragraph strings with optional hanging
indents.

## Install

```bash
npm install wrapify
```

## Usage

### ESM (Node/Deno/Browsers)

```js
import wrapify, {wrapify as wrap, iwrapify} from "wrapify"

const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
console.log(wrap(text, 50, 2))
console.log(iwrapify(text, 50, 4))
```

## CDN

- esm.sh: `import {wrapify} from "https://esm.sh/@gesslar/wrapify"`
- jsDelivr (ESM): `import wrapify from "https://cdn.jsdelivr.net/npm/@gesslar/wrapify/+esm"`

## API

- `wrapify(text?, maxLineLength = 80, indent = 3)` – wraps text with a hanging
  indent applied to every line.
- `iwrapify(text?, maxLineLength = 80, indent = 4)` – wraps text with an indent
  applied after the first line.

Both helpers normalize blank lines between paragraphs and collapse excessive
whitespace. Empty, `null`, or `undefined` input returns an empty string.
