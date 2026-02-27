// Simulates text pasted from a MUD client into a web app.
// Contains: extra spaces, tabs, \r\n line endings, excessive blank lines,
// leading/trailing whitespace on lines — all the messiness wrapify should clean up.
export const messyMudText = [
  "You enter the grand hall.   The torches flicker\talong the walls.",
  "",
  "",
  "",
  "",
  "A massive dragon sits upon\r\na pile of gold,",
  "  its eyes glowing   red.",
  "",
  "",
  "",
  "",
  "",
  "The air smells of sulfur and ash.",
].join("\n")

export const expectedParagraphCount = 3
