// eslint.config.js
import uglify from "@gesslar/uglier"

export default [
  ...uglify({
    with: ["lints-js", "lints-jsdoc", "web"],
    overrides: {
      "lints-js": {files: ["wrapify.js"]},
      "lints-jsdoc": {files: ["wrapify.js"]}
    }
  })
]
