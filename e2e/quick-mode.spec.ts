import { expect, test, type Page } from "@playwright/test";

/**
 * Primary flow smoke: paste text -> Quick mode (no AI) -> generate quiz ->
 * play -> score. Exercised on desktop and a mobile viewport, plus a
 * keyboard-only pass. No network/AI is involved; everything is deterministic.
 */

const SOURCE_TEXT = `Photosynthesis is the process by which green plants convert light energy into chemical energy.
Chlorophyll is the pigment that absorbs sunlight inside the chloroplast.
The light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH.
The Calvin cycle uses ATP and NADPH to fix carbon dioxide into glucose.
Cellular respiration is the reverse process that releases energy from glucose.
Mitochondria are the organelles where cellular respiration takes place.
Glucose is a simple sugar that stores chemical energy for the cell.
Oxygen is released as a byproduct of the light-dependent reactions.
Water is split during photosynthesis to supply electrons and protons.`;

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

async function pasteAndConfigure(page: Page): Promise<void> {
  await page.goto("/tool");
  await dismissConsent(page);

  // Source step: paste text and continue.
  await page.getByLabel("Text or markdown").fill(SOURCE_TEXT);
  await page.getByRole("button", { name: "Use this text" }).click();

  // Configure step defaults to Quick mode (no AI); confirm the badge is shown.
  await expect(page.getByText("Quick mode (no AI)").first()).toBeVisible();
}

test("generates and plays a Quick-mode quiz by pointer to a score", async ({ page }) => {
  await pasteAndConfigure(page);

  await page.getByRole("button", { name: "Generate quiz" }).click();

  // Review step: the editor appears; start playing.
  await page.getByRole("button", { name: "Play quiz" }).click();

  // Player: answer each question until results appear.
  const results = page.locator('section[aria-label^="Results for"]');
  for (let i = 0; i < 30; i++) {
    if (await results.isVisible().catch(() => false)) break;

    const option = page.getByRole("option").first();
    const textInput = page.getByLabel("Your answer");
    if (await option.isVisible().catch(() => false)) {
      await option.click();
    } else if (await textInput.isVisible().catch(() => false)) {
      await textInput.fill("test");
    }

    await page.getByRole("button", { name: "Check answer" }).click();
    await page
      .getByRole("button", { name: /Next question|See results/ })
      .click();
  }

  // Results: a percentage score is shown.
  await expect(results).toBeVisible();
  await expect(results.getByText(/%/).first()).toBeVisible();
});

test("plays an MCQ Quick-mode quiz with the keyboard only", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "keyboard pass runs on desktop");

  await pasteAndConfigure(page);

  // Narrow to multiple-choice only so number-key selection applies throughout.
  await page.getByText("Fill in the blank").click();
  await page.getByRole("button", { name: "Generate quiz" }).click();
  await page.getByRole("button", { name: "Play quiz" }).click();

  const results = page.locator('section[aria-label^="Results for"]');
  for (let i = 0; i < 30; i++) {
    if (await results.isVisible().catch(() => false)) break;
    // 1 selects the first option, Enter checks, Enter advances (spec F3).
    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
  }

  await expect(results).toBeVisible();
  await expect(results.getByText(/%/).first()).toBeVisible();
});

test("mobile viewport reaches the configure step", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "mobile-only assertion");

  await page.goto("/tool");
  await dismissConsent(page);
  await page.getByLabel("Text or markdown").fill(SOURCE_TEXT);
  await page.getByRole("button", { name: "Use this text" }).click();

  await expect(page.getByRole("heading", { name: "Configure" })).toBeVisible();
});
