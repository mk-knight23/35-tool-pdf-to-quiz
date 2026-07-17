import { describe, expect, test } from "vitest";
import { CREATOR, FOOTER_SENTENCE, NAV_LINKS, SITE } from "./site";

describe("site + creator identity (STANDARDS §3)", () => {
  test("uses the exact required footer sentence", () => {
    // Act / Assert
    expect(FOOTER_SENTENCE).toBe(
      "Built and maintained by Kazi Musharraf. Open source for everyone.",
    );
  });

  test("names the creator and links exactly as specified", () => {
    // Assert
    expect(CREATOR.name).toBe("Kazi Musharraf");
    expect(CREATOR.github).toBe("https://github.com/mk-knight23");
    expect(CREATOR.portfolio).toBe("https://www.mkazi.live");
  });

  test("exposes a canonical site url with no trailing slash", () => {
    // Assert
    expect(SITE.url).not.toMatch(/\/$/);
    expect(SITE.url.startsWith("http")).toBe(true);
  });

  test("provides the primary navigation links", () => {
    // Act
    const hrefs = NAV_LINKS.map((l) => l.href);

    // Assert
    expect(hrefs).toContain("/tool");
    expect(hrefs).toContain("/dashboard");
  });
});
