import { expect, test } from "@playwright/test";
import { DEMO_SCRIPT } from "../src/demo.ts";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Demo button fills the editor with a fully-evaluating example", async ({
  page,
}) => {
  const textarea = page.locator(".codeflask__textarea");

  await page.locator("#demo").click();

  await expect(textarea).toHaveValue(DEMO_SCRIPT);
  await expect(page.locator("#save")).toHaveText("Save *");

  const sidebarText = await page
    .locator(".codeflask__right-sidebar")
    .innerText();
  // Spot-check a few results from different features of the demo script,
  // rather than the full output, so this isn't rewritten every time the
  // wording of DEMO_SCRIPT changes.
  expect(sidebarText).toContain("$6");
  expect(sidebarText).toContain("$1,687.5");
  expect(sidebarText).toContain("$350,000");
  expect(sidebarText).toContain("42.1648128 km");
  expect(sidebarText).toContain("$0.48");
  expect(sidebarText.toLowerCase()).not.toContain("undefined symbol");
});

test("Demo button confirms before overwriting unsaved changes", async ({
  page,
}) => {
  const textarea = page.locator(".codeflask__textarea");
  await textarea.fill("my_data = 42");

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#demo").click();
  await expect(textarea).toHaveValue("my_data = 42");

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#demo").click();
  await expect(textarea).toHaveValue(DEMO_SCRIPT);
});
