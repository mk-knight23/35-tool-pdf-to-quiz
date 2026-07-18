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

async function pasteAndStartBasic(page: Page): Promise<void> {
  await page.goto("/");
  await dismissConsent(page);

  // Source step: paste text
  await page.getByLabel("Notes, text or markdown").fill(SOURCE_TEXT);
  // Click "Create a quiz" directly (sensible defaults, quick mode)
  await page.getByRole("button", { name: "Create a quiz" }).click();
}

test("generates and plays a Quick-mode quiz by pointer to a score", async ({ page }) => {
  await pasteAndStartBasic(page);

  // Player: answer each question until results appear.
  const results = page.locator('section[aria-label^="Results for"]');
  for (let i = 0; i < 30; i++) {
    const option = page.getByRole("option").first();
    const textInput = page.getByLabel("Your answer");

    // Wait for the active question UI to load
    await Promise.any([
      option.waitFor({ state: "visible", timeout: 5000 }).catch(() => {}),
      textInput.waitFor({ state: "visible", timeout: 5000 }).catch(() => {}),
      results.waitFor({ state: "visible", timeout: 5000 }).catch(() => {})
    ]);

    if (await results.isVisible().catch(() => false)) break;

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

  await page.goto("/");
  await dismissConsent(page);

  // Paste text
  await page.getByLabel("Notes, text or markdown").fill(SOURCE_TEXT);

  // Expand advanced options to select MCQ only
  await page.getByRole("button", { name: "Advanced customization options" }).click();
  await page.getByRole("button", { name: "True / False", exact: true }).click();
  await page.getByRole("button", { name: "Short Answer", exact: true }).click();
  await page.getByRole("button", { name: "Fill in the blank", exact: true }).click();

  // Create quiz
  await page.getByRole("button", { name: "Create a quiz" }).click();

  const results = page.locator('section[aria-label^="Results for"]');
  for (let i = 0; i < 30; i++) {
    // Wait for option or results
    const option = page.getByRole("option").first();
    await Promise.any([
      option.waitFor({ state: "visible", timeout: 5000 }).catch(() => {}),
      results.waitFor({ state: "visible", timeout: 5000 }).catch(() => {})
    ]);

    if (await results.isVisible().catch(() => false)) break;
    // 1 selects the first option, Enter checks, Enter advances (spec F3).
    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
  }

  await expect(results).toBeVisible();
  await expect(results.getByText(/%/).first()).toBeVisible();
});

test("mobile viewport generates and starts a quiz", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "mobile-only assertion");

  await page.goto("/");
  await dismissConsent(page);
  await page.getByLabel("Notes, text or markdown").fill(SOURCE_TEXT);
  await page.getByRole("button", { name: "Create a quiz" }).click();

  await expect(page.getByRole("button", { name: "Check answer" })).toBeVisible();
});
