import { test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Captures real product screenshots for the README/docs. Desktop only so the
 * images are a consistent size. Written to public/screenshots.
 */

const OUT_DIR = join(process.cwd(), "public", "screenshots");

const SOURCE_TEXT = `Photosynthesis is the process by which green plants convert light energy into chemical energy.
Chlorophyll is the pigment that absorbs sunlight inside the chloroplast.
The light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH.
The Calvin cycle uses ATP and NADPH to fix carbon dioxide into glucose.
Mitochondria are the organelles where cellular respiration takes place.
Glucose is a simple sugar that stores chemical energy for the cell.
Oxygen is released as a byproduct of the light-dependent reactions.`;

async function dismissConsent(page: Page): Promise<void> {
  // The banner mounts after hydration (a queued timeout), so wait for it before
  // clicking; once a choice is stored it never reappears on later navigations.
  const decline = page.getByRole("button", { name: "Decline" });
  try {
    await decline.waitFor({ state: "visible", timeout: 5000 });
    await decline.click();
    await decline.waitFor({ state: "hidden", timeout: 5000 });
  } catch {
    // No banner means consent was already recorded this context — nothing to do.
  }
}

test.beforeAll(() => {
  mkdirSync(OUT_DIR, { recursive: true });
});

test("captures homepage and quiz-player screenshots", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "screenshots on desktop");
  await page.setViewportSize({ width: 1280, height: 900 });

  // Landing page.
  await page.goto("/");
  await dismissConsent(page);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: join(OUT_DIR, "home.png"), fullPage: true });

  // Quiz player mid-flow.
  await page.goto("/");
  await dismissConsent(page);
  await page.getByLabel("Notes, text or markdown").fill(SOURCE_TEXT);
  await page.getByRole("button", { name: "Create a quiz" }).click();
  await page.getByRole("option").first().waitFor();
  await page.screenshot({ path: join(OUT_DIR, "quiz-player.png") });
});
