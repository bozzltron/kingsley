const TextProcessor = require("../TextProcessor");
const innerText = require("./mocks/innerText");

describe("TextProcessor", () => {
  describe("processGoogleSearchResults", () => {
    it("should process google search results", () => {
      expect(TextProcessor.processGoogleSearchResults(innerText)).toEqual([]);
    });
  });
});
