import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Test App/);
});

test('check basic structure', async ({ page }) => {

  const DataGridColumnLocator = (text: string) => page.locator(".MuiDataGrid-columnHeader", { hasText: text });

  await page.setViewportSize({ width: 1600, height: 1200 });

  await page.goto('http://localhost:3000/');

  await expect(page.getByText('Bills')).toBeVisible();
  await expect(page.getByText('Enabling filtering...')).toBeVisible();

  // You see 1 tab
  await expect(page.locator("h1", { hasText: 'Bills' })).toBeVisible();
  await expect(page.getByText('Favourites')).toBeHidden();

  // columns
  await expect(DataGridColumnLocator('Favourite')).toBeVisible();
  await expect(DataGridColumnLocator('Bill No')).toBeVisible();
  await expect(DataGridColumnLocator('Type')).toBeVisible();
  await expect(DataGridColumnLocator('Status')).toBeVisible();
  await expect(DataGridColumnLocator('Sponsors')).toBeVisible();

  const TypeColumn =  DataGridColumnLocator('Type');
  await expect(TypeColumn).toBeVisible();
  await TypeColumn.hover();
  await DataGridColumnLocator('Type').locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeSmall").click();

  const menu = page.locator(".MuiDataGrid-menu");
  await expect(menu).toBeVisible();

  await expect(page.locator(".MuiDataGrid-menu")).toBeVisible();
  expect(menu.locator(".MuiButtonBase-root", {hasText: "Filter"})).toBeHidden();

  await page.waitForLoadState('networkidle');
 
  await expect(menu.locator(".MuiButtonBase-root", {hasText: "Filter"})).toBeVisible();
  await expect(page.getByText('Enabling filtering...')).toBeHidden();
  await expect(page.locator("h1", { hasText: 'Bills' })).toBeVisible();

  const favouritesTab = page.locator(".MuiTab-root", { hasText: "Favourites" });
  await expect(favouritesTab).toBeVisible();
  await favouritesTab.click();

  await expect(DataGridColumnLocator('Favourite')).toBeHidden();
  await expect(DataGridColumnLocator('Bill No')).toBeVisible();
  await expect(DataGridColumnLocator('Type')).toBeVisible();
  await expect(DataGridColumnLocator('Status')).toBeVisible();
  await expect(DataGridColumnLocator('Sponsors')).toBeVisible();

  // test favourites
  
  // test filtering and



});
