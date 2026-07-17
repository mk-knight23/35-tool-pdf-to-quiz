import { describe, expect, test } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  test("joins truthy class names and drops falsy ones", () => {
    // Act / Assert
    expect(cn("a", false && "b", "c", undefined, null)).toBe("a c");
  });

  test("lets a later Tailwind utility win over a conflicting earlier one", () => {
    // Act / Assert
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("supports conditional object syntax", () => {
    // Act / Assert
    expect(cn({ active: true, hidden: false })).toBe("active");
  });
});
