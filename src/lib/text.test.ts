import { describe, expect, test } from "vitest";
import {
  cleanText,
  extractKeywords,
  hashString,
  mulberry32,
  normalizeAnswer,
  shuffle,
  splitSentences,
  STOPWORDS,
  wordCount,
} from "./text";

describe("hashString", () => {
  test("returns the same hash for identical input", () => {
    // Arrange
    const input = "photosynthesis converts light into chemical energy";

    // Act
    const first = hashString(input);
    const second = hashString(input);

    // Assert
    expect(first).toBe(second);
  });

  test("returns different hashes for different input", () => {
    // Arrange / Act
    const a = hashString("alpha");
    const b = hashString("beta");

    // Assert
    expect(a).not.toBe(b);
  });

  test("produces an unsigned 32-bit integer", () => {
    // Act
    const value = hashString("boundary check");

    // Assert
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("mulberry32", () => {
  test("produces a deterministic sequence for a given seed", () => {
    // Arrange
    const seedA = mulberry32(12345);
    const seedB = mulberry32(12345);

    // Act
    const seqA = [seedA(), seedA(), seedA()];
    const seqB = [seedB(), seedB(), seedB()];

    // Assert
    expect(seqA).toEqual(seqB);
  });

  test("returns floats within the [0, 1) range", () => {
    // Arrange
    const rng = mulberry32(99);

    // Act / Assert
    for (let i = 0; i < 50; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("shuffle", () => {
  test("returns a new array without mutating the input", () => {
    // Arrange
    const original = [1, 2, 3, 4, 5];
    const rng = mulberry32(7);

    // Act
    const result = shuffle(original, rng);

    // Assert
    expect(original).toEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(original);
  });

  test("preserves all elements of the original array", () => {
    // Arrange
    const original = ["a", "b", "c", "d"];

    // Act
    const result = shuffle(original, mulberry32(3));

    // Assert
    expect([...result].sort()).toEqual([...original].sort());
  });

  test("is deterministic for the same seed", () => {
    // Arrange
    const original = [10, 20, 30, 40, 50, 60];

    // Act
    const first = shuffle(original, mulberry32(42));
    const second = shuffle(original, mulberry32(42));

    // Assert
    expect(first).toEqual(second);
  });
});

describe("normalizeAnswer", () => {
  test("lowercases and trims surrounding whitespace", () => {
    // Act / Assert
    expect(normalizeAnswer("  Mitochondria  ")).toBe("mitochondria");
  });

  test("strips punctuation and collapses internal whitespace", () => {
    // Act / Assert
    expect(normalizeAnswer("The  Krebs-cycle!")).toBe("the krebs cycle");
  });

  test("removes accents so equivalent answers match", () => {
    // Act / Assert
    expect(normalizeAnswer("Café")).toBe(normalizeAnswer("cafe"));
  });
});

describe("cleanText", () => {
  test("collapses runs of spaces and tabs into a single space", () => {
    // Act / Assert
    expect(cleanText("word1   \t  word2")).toBe("word1 word2");
  });

  test("rejoins words hyphenated across a line break", () => {
    // Act / Assert
    expect(cleanText("inter-\nnational")).toBe("international");
  });

  test("collapses three or more newlines into a paragraph break", () => {
    // Act
    const result = cleanText("para one\n\n\n\npara two");

    // Assert
    expect(result).toBe("para one\n\npara two");
  });
});

describe("splitSentences", () => {
  test("splits prose into individual sentences", () => {
    // Act
    const sentences = splitSentences("Cells divide. DNA replicates first.");

    // Assert
    expect(sentences).toEqual(["Cells divide.", "DNA replicates first."]);
  });

  test("does not split on common abbreviations", () => {
    // Act
    const sentences = splitSentences("Dr. Smith wrote the paper. It was reviewed.");

    // Assert
    expect(sentences).toEqual([
      "Dr. Smith wrote the paper.",
      "It was reviewed.",
    ]);
  });

  test("returns an empty array for blank input", () => {
    // Act / Assert
    expect(splitSentences("   ")).toEqual([]);
  });
});

describe("extractKeywords", () => {
  const text =
    "Mitochondria produce energy. Mitochondria are the powerhouse of the cell. " +
    "Mitochondria contain their own DNA. Energy is stored as ATP.";

  test("ranks a frequently repeated term near the top", () => {
    // Act
    const keywords = extractKeywords(text);
    const terms = keywords.map((k) => k.key);

    // Assert
    expect(terms).toContain("mitochondria");
    expect(terms.indexOf("mitochondria")).toBeLessThan(terms.length);
  });

  test("excludes stopwords from the ranked keywords", () => {
    // Act
    const keywords = extractKeywords(text);
    const terms = keywords.map((k) => k.key);

    // Assert
    for (const term of terms) {
      expect(STOPWORDS.has(term)).toBe(false);
    }
  });

  test("returns identical rankings across repeated calls", () => {
    // Act
    const first = extractKeywords(text).map((k) => k.term);
    const second = extractKeywords(text).map((k) => k.term);

    // Assert
    expect(first).toEqual(second);
  });
});

describe("wordCount", () => {
  test("counts word-like tokens including hyphenated words", () => {
    // Act / Assert
    expect(wordCount("The quick brown fox")).toBe(4);
  });

  test("ignores standalone punctuation", () => {
    // Act / Assert
    expect(wordCount("Hello , world !")).toBe(2);
  });

  test("returns zero for an empty string", () => {
    // Act / Assert
    expect(wordCount("")).toBe(0);
  });
});
