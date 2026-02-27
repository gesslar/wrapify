import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { iwrapify } from "../src/wrapify.js"
import { messyMudText, expectedParagraphCount } from "./fixtures/messy-mud-text.js"

describe("iwrapify", () => {
  describe("empty/null input", () => {
    it("returns empty string for no arguments", () => {
      assert.equal(iwrapify(), "")
    })

    it("returns empty string for empty string", () => {
      assert.equal(iwrapify(""), "")
    })

    it("returns empty string for null", () => {
      assert.equal(iwrapify(null), "")
    })

    it("returns empty string for undefined", () => {
      assert.equal(iwrapify(undefined), "")
    })
  })

  describe("basic wrapping", () => {
    it("does not indent a short single-line text", () => {
      const result = iwrapify("hello world", 80, 4)
      // First line should NOT be indented
      assert.ok(!result.startsWith(" "), "first line should not be indented")
      assert.ok(result.includes("hello world"))
    })

    it("indents continuation lines by indent amount", () => {
      const text = "one two three four five six seven eight nine ten"
      const result = iwrapify(text, 20, 4)
      const lines = result.split("\n").filter(l => l.length > 0)

      // First line should not be indented
      assert.ok(!lines[0].startsWith(" "), "first line should not start with space")

      // Continuation lines should be indented by 4 spaces
      for (let i = 1; i < lines.length; i++) {
        assert.ok(lines[i].startsWith("    "), `line ${i} should be indented: "${lines[i]}"`)
      }
    })

    it("first line uses full maxLineLength", () => {
      const text = "one two three four five six seven eight nine ten"
      const result = iwrapify(text, 20, 4)
      const lines = result.split("\n").filter(l => l.length > 0)

      assert.ok(lines[0].length <= 20, `first line too long: "${lines[0]}" (${lines[0].length})`)
    })

    it("continuation lines respect maxLineLength", () => {
      const text = "one two three four five six seven eight nine ten eleven twelve"
      const result = iwrapify(text, 20, 4)
      const lines = result.split("\n").filter(l => l.length > 0)

      for (let i = 1; i < lines.length; i++) {
        assert.ok(lines[i].length <= 20, `line ${i} too long: "${lines[i]}" (${lines[i].length})`)
      }
    })
  })

  describe("paragraph handling", () => {
    it("wraps multiple paragraphs independently", () => {
      const text = "first paragraph\n\nsecond paragraph"
      const result = iwrapify(text, 80, 4)

      assert.ok(result.includes("first paragraph"), "should contain first paragraph")
      assert.ok(result.includes("second paragraph"), "should contain second paragraph")
      assert.ok(result.includes("\n\n"), "paragraphs should be separated by blank line")
    })

    it("normalizes 3+ consecutive newlines to paragraph breaks", () => {
      const text = "first\n\n\n\n\nsecond"
      const result = iwrapify(text, 80, 4)

      const paragraphs = result.split("\n\n")
      assert.equal(paragraphs.length, 2)
    })
  })

  describe("line ending normalization", () => {
    it("converts \\r\\n to \\n", () => {
      const text = "hello\r\nworld"
      const result = iwrapify(text, 80, 4)

      assert.ok(!result.includes("\r"), "should not contain \\r")
      assert.ok(result.includes("hello world"), "words should be joined")
    })
  })

  describe("whitespace handling", () => {
    it("collapses tabs to spaces", () => {
      const text = "hello\tworld"
      const result = iwrapify(text, 80, 4)
      assert.ok(result.includes("hello world"), "tabs should become spaces")
    })

    it("trims leading and trailing whitespace from lines", () => {
      const text = "  hello  \n  world  "
      const result = iwrapify(text, 80, 4)
      assert.ok(result.includes("hello world"))
    })

    it("collapses multiple spaces between words", () => {
      const text = "hello    world"
      const result = iwrapify(text, 80, 4)
      assert.ok(result.includes("hello world"), "multiple spaces should collapse to one")
      assert.ok(!result.includes("  "), "should not contain consecutive spaces in content")
    })
  })

  describe("default parameters", () => {
    it("uses maxLineLength=80 and indent=4 by default", () => {
      const words = []
      for (let i = 0; i < 30; i++) words.push("word")
      const text = words.join(" ")
      const result = iwrapify(text)
      const lines = result.split("\n").filter(l => l.length > 0)

      // First line should not be indented
      assert.ok(!lines[0].startsWith(" "), "first line should not be indented")
      assert.ok(lines[0].length <= 80, "first line should not exceed 80 chars")

      // Continuation lines should be indented by 4
      if (lines.length > 1) {
        assert.ok(lines[1].startsWith("    "), "continuation line should have 4-space indent")
      }
    })
  })

  describe("custom parameters", () => {
    it("respects custom maxLineLength", () => {
      const text = "one two three four five six seven eight"
      const result = iwrapify(text, 15, 0)
      const lines = result.split("\n").filter(l => l.length > 0)

      for (const line of lines) {
        assert.ok(line.length <= 15, `line too long: "${line}" (${line.length})`)
      }
    })

    it("respects custom indent", () => {
      const text = "one two three four five six seven eight nine ten"
      const result = iwrapify(text, 20, 6)
      const lines = result.split("\n").filter(l => l.length > 0)

      if (lines.length > 1) {
        assert.ok(lines[1].startsWith("      "), "continuation should have 6-space indent")
      }
    })

    it("works with indent=0", () => {
      const text = "one two three four five six seven eight nine ten"
      const result = iwrapify(text, 20, 0)
      const lines = result.split("\n").filter(l => l.length > 0)

      for (const line of lines) {
        assert.ok(!line.startsWith(" "), "no lines should be indented when indent=0")
      }
    })
  })

  describe("MUD text integration", () => {
    it("normalizes messy pasted text into clean book-like paragraphs", () => {
      const result = iwrapify(messyMudText, 60, 4)
      const paragraphs = result.split("\n\n")

      assert.equal(paragraphs.length, expectedParagraphCount,
        `expected ${expectedParagraphCount} paragraphs, got ${paragraphs.length}`)

      // No carriage returns survive
      assert.ok(!result.includes("\r"), "should not contain \\r")

      // No tabs survive
      assert.ok(!result.includes("\t"), "should not contain tabs")

      // No consecutive spaces in content (check each line after trimming indent)
      const lines = result.split("\n")
      for (const line of lines) {
        const content = line.trimStart()
        assert.ok(!content.includes("  "),
          `consecutive spaces found in: "${line}"`)
      }

      // No runs of 3+ newlines (all normalized to paragraph breaks)
      assert.ok(!result.includes("\n\n\n"), "should not contain 3+ consecutive newlines")

      // Each paragraph's first line should NOT be indented (iwrapify style)
      for (const para of paragraphs) {
        const firstLine = para.split("\n")[0]
        assert.ok(!firstLine.startsWith(" "),
          `paragraph first line should not be indented: "${firstLine}"`)
      }

      // Continuation lines within paragraphs should be indented
      for (const para of paragraphs) {
        const paraLines = para.split("\n").filter(l => l.length > 0)
        for (let i = 1; i < paraLines.length; i++) {
          assert.ok(paraLines[i].startsWith("    "),
            `continuation line should be indented: "${paraLines[i]}"`)
        }
      }

      // No line exceeds the max length
      for (const line of lines) {
        if (line.length > 0) {
          assert.ok(line.length <= 60,
            `line exceeds max length: "${line}" (${line.length})`)
        }
      }
    })
  })
})
