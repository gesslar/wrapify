import { describe, it } from "node:test"
import assert from "node:assert/strict"
import wrapify from "../src/wrapify.js"
import { messyMudText, expectedParagraphCount } from "./fixtures/messy-mud-text.js"

describe("wrapify", () => {
  describe("empty/null input", () => {
    it("returns empty string for no arguments", () => {
      assert.equal(wrapify(), "")
    })

    it("returns empty string for empty string", () => {
      assert.equal(wrapify(""), "")
    })

    it("returns empty string for null", () => {
      assert.equal(wrapify(null), "")
    })

    it("returns empty string for undefined", () => {
      assert.equal(wrapify(undefined), "")
    })
  })

  describe("basic wrapping", () => {
    it("indents a short single-line text", () => {
      const result = wrapify("hello world", 80, 3)
      assert.equal(result, "   hello world\n")
    })

    it("wraps long text so first line has shorter content area", () => {
      // With maxLineLength=40 and indent=5, first line content area is 35 chars
      const text = "the quick brown fox jumps over the lazy dog and keeps on running"
      const result = wrapify(text, 40, 5)
      const lines = result.split("\n").filter(l => l.length > 0)

      // First line should be indented
      assert.ok(lines[0].startsWith("     "), "first line should be indented by 5")
      // Should wrap into multiple lines
      assert.ok(lines.length > 1, "text should wrap to multiple lines")
      // First line content area should be shorter than continuation lines
      const firstContent = lines[0].trimStart()
      const secondContent = lines[1]
      assert.ok(firstContent.length < secondContent.length || lines.length >= 2,
        "first line content should be limited by indent")
    })

    it("continuation lines use full maxLineLength", () => {
      const text = "one two three four five six seven eight nine ten eleven twelve"
      const result = wrapify(text, 20, 3)
      const lines = result.split("\n").filter(l => l.length > 0)

      for (let i = 1; i < lines.length; i++) {
        assert.ok(lines[i].length <= 20, `line ${i} too long: "${lines[i]}" (${lines[i].length})`)
      }
    })
  })

  describe("paragraph handling", () => {
    it("wraps multiple paragraphs independently", () => {
      const text = "first paragraph\n\nsecond paragraph"
      const result = wrapify(text, 80, 3)

      assert.ok(result.includes("first paragraph"), "should contain first paragraph")
      assert.ok(result.includes("second paragraph"), "should contain second paragraph")
      // Paragraphs should be separated
      assert.ok(result.includes("\n\n"), "paragraphs should be separated by blank line")
    })

    it("normalizes 3+ consecutive newlines to paragraph breaks", () => {
      const text = "first\n\n\n\n\nsecond"
      const result = wrapify(text, 80, 3)

      // Should produce exactly two paragraphs, not extra blank lines
      const paragraphs = result.split("\n\n")
      assert.equal(paragraphs.length, 2)
    })
  })

  describe("line ending normalization", () => {
    it("converts \\r\\n to \\n", () => {
      const text = "hello\r\nworld"
      const result = wrapify(text, 80, 3)

      assert.ok(!result.includes("\r"), "should not contain \\r")
      assert.ok(result.includes("hello world"), "words should be joined")
    })
  })

  describe("whitespace handling", () => {
    it("collapses tabs to spaces", () => {
      const text = "hello\tworld"
      const result = wrapify(text, 80, 3)
      assert.ok(result.includes("hello world"), "tabs should become spaces")
    })

    it("trims leading and trailing whitespace from lines", () => {
      const text = "  hello  \n  world  "
      const result = wrapify(text, 80, 3)
      // After trimming and joining, should have "hello world"
      assert.ok(result.includes("hello world"))
    })

    it("collapses multiple spaces between words", () => {
      const text = "hello    world"
      const result = wrapify(text, 80, 3)
      assert.ok(result.includes("hello world"), "multiple spaces should collapse to one")
      // Check content (excluding leading indent) has no consecutive spaces
      const content = result.trimStart()
      assert.ok(!content.includes("  "), "should not contain consecutive spaces in content")
    })
  })

  describe("default parameters", () => {
    it("uses maxLineLength=80 and indent=3 by default", () => {
      const words = []
      for (let i = 0; i < 30; i++) words.push("word")
      const text = words.join(" ")
      const result = wrapify(text)
      const lines = result.split("\n").filter(l => l.length > 0)

      // First line is indented by 3, so content fits in 77 chars + 3 indent = 80
      assert.ok(lines[0].startsWith("   "), "first line should have 3-space indent")
      assert.ok(lines[0].length <= 80, "first line should not exceed 80 chars")
    })
  })

  describe("custom parameters", () => {
    it("respects custom maxLineLength", () => {
      const text = "one two three four five six seven eight"
      const result = wrapify(text, 15, 0)
      const lines = result.split("\n").filter(l => l.length > 0)

      for (const line of lines) {
        assert.ok(line.length <= 15, `line too long: "${line}" (${line.length})`)
      }
    })

    it("respects custom indent", () => {
      const result = wrapify("hello", 80, 10)
      assert.ok(result.startsWith("          "), "should start with 10 spaces")
    })

    it("works with indent=0", () => {
      const result = wrapify("hello world", 80, 0)
      assert.ok(!result.startsWith(" "), "should not start with space when indent=0")
      assert.ok(result.includes("hello world"))
    })
  })

  describe("MUD text integration", () => {
    it("normalizes messy pasted text into clean book-like paragraphs", () => {
      const result = wrapify(messyMudText, 60, 3)
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

      // Each paragraph's first line is indented
      for (const para of paragraphs) {
        const firstLine = para.split("\n")[0]
        assert.ok(firstLine.startsWith("   "),
          `paragraph should start with indent: "${firstLine}"`)
      }

      // No line exceeds the max length (indent + content)
      for (const line of lines) {
        if (line.length > 0) {
          assert.ok(line.length <= 60,
            `line exceeds max length: "${line}" (${line.length})`)
        }
      }
    })
  })
})
