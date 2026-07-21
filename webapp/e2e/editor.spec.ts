import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

function sidebarLines(page: import("@playwright/test").Page) {
  return page.locator(".codeflask__right-sidebar > span").allTextContents();
}

test("evaluates an expression and shows the result in the sidebar", async ({
  page,
}) => {
  await page.locator(".codeflask__textarea").fill("1 + 1");

  await expect.poll(async () => (await sidebarLines(page))[0]).toBe("2");
});

test("multi-word variables and prefix currency work together", async ({
  page,
}) => {
  await page
    .locator(".codeflask__textarea")
    .fill("price per apple = $2\ntotal = price per apple * 3");

  await expect.poll(() => sidebarLines(page)).toEqual(["$2", "$6"]);
});

test("Save writes to the URL hash, and reloading restores the editor", async ({
  page,
}) => {
  const textarea = page.locator(".codeflask__textarea");
  await textarea.fill("x = 5\ny = x * 2");
  await expect.poll(() => sidebarLines(page)).toEqual(["5", "10"]);

  await page.locator("#save").click();
  await expect(page).toHaveURL(/#./);
  await expect(page.locator("#save")).toHaveText("Save");

  await page.reload();

  await expect(textarea).toHaveValue("x = 5\ny = x * 2");
  await expect.poll(() => sidebarLines(page)).toEqual(["5", "10"]);
});
