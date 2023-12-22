import { test, expect } from '@playwright/test';
import { mockedLegislations, 
  mockedLegsislations_pageSize10_page1,
  mockedLegsislations_pageSize10_page2,
  mockedLegsislations_pageSize10_page3,
  hybridLegislationsMock
 } from "./mocks";
 
 test('Pagination and filtering', async ({ page }) => {
 
   const DataGridColumnLocator = (text: string) => page.locator(".MuiDataGrid-columnHeader", { hasText: text });
   const favouritesTab = page.locator(".MuiTab-root", { hasText: "Favourites" });
   const allTabTab = page.locator(".MuiTab-root", { hasText: "All" });
   const TypeColumn =  DataGridColumnLocator('Type');
   const menu = page.locator(".MuiDataGrid-menu");
   const filterMenuItem = menu.locator(".MuiButtonBase-root", {hasText: "Filter"});
   const infoMessage = page.getByText("Enabling filtering...");
   const header = page.locator("h1", { hasText: 'Bills' });
   const typeColumnMenuLocator = DataGridColumnLocator('Type').locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeSmall");
   const filterEntry = page.getByPlaceholder("Filter value");

   const pageCountsIndicator = page.locator(".MuiTablePagination-displayedRows")
   // queries
   const queryNoFilter = (queryUrl: string, skip: number, limit: number) => queryUrl.includes(`skip=${skip}`) 
    && queryUrl.includes(`limit=${limit}`) && !queryUrl.includes("bill_type");
  const queryWithFilter = (queryUrl: string, skip: number, limit: number, filterStr: string) => queryUrl.includes(`skip=${skip}`) 
    && queryUrl.includes(`limit=${limit}`) && queryUrl.includes(`bill_type=${filterStr}`);

 
   await page.goto('http://localhost:3000/');
 
   await expect(page.getByText('Bills')).toBeVisible();
   await expect(infoMessage).toBeVisible();
 
   // You see 1 tab
   await expect(page.locator("h1", { hasText: 'Bills' })).toBeVisible();
   await expect(favouritesTab).toBeHidden();
 
   // columns
   await expect(DataGridColumnLocator('Favourite')).toBeVisible();
   await expect(DataGridColumnLocator('Bill No')).toBeVisible();
   await expect(DataGridColumnLocator('Type')).toBeVisible();
   await expect(DataGridColumnLocator('Status')).toBeVisible();
   await expect(DataGridColumnLocator('Sponsors')).toBeVisible();
 
   // no filtering yet
   await expect(TypeColumn).toBeVisible();
   await TypeColumn.hover();
   await typeColumnMenuLocator.click();
 
   await expect(menu).toBeVisible();
 
   await expect(menu).toBeVisible();
   expect(filterMenuItem).toBeHidden();
 
   await page.waitForLoadState('networkidle'); // prefetch is done
  
   await expect(filterMenuItem).toBeVisible();
   await expect(infoMessage).toBeHidden();
   await expect(header).toBeVisible();
 
   await expect(favouritesTab).toBeVisible();
   await favouritesTab.click();
 
   await expect(DataGridColumnLocator('Favourite')).toBeHidden();
   await expect(DataGridColumnLocator('Bill No')).toBeVisible();
   await expect(DataGridColumnLocator('Type')).toBeVisible();
   await expect(DataGridColumnLocator('Status')).toBeVisible();
   await expect(DataGridColumnLocator('Sponsors')).toBeVisible();

   await page.route('http://localhost:3000/legislation?**', async route => {

    const queryUrl = route.request().url();
    if (queryNoFilter(queryUrl, 0, 10)) {
        route.fulfill({ json: mockedLegsislations_pageSize10_page1 });
    }
    if (queryNoFilter(queryUrl, 10, 20)) {
      route.fulfill({ json: mockedLegsislations_pageSize10_page2 });
    }
    if (queryNoFilter(queryUrl, 20, 10)) {
      route.fulfill({ json: mockedLegsislations_pageSize10_page3 });
    }
    if (queryWithFilter(queryUrl, 0, 10, 'hy')) {
      route.fulfill({ json: hybridLegislationsMock });
    }
   });

   await allTabTab.click();

  await expect(pageCountsIndicator).toHaveText("1–10 of 25");
  await page.getByTitle("Go to next page").click();
  await expect(pageCountsIndicator).toHaveText("11–20 of 25");
  await page.getByTitle("Go to previous page").click();
  await expect(pageCountsIndicator).toHaveText("1–10 of 25");

  // enter filter
  await TypeColumn.hover();
  await typeColumnMenuLocator.click();
  await filterMenuItem.click();
  await filterEntry.fill("hy");

  await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("1–2 of 2");
  expect((await page.locator("[data-rowindex]").all()).length).toBe(2);
  expect((await page.locator("[data-rowindex]", { hasText:"Hybrid" }).all()).length).toBe(2);

 
  });

test("Favourites", () => {
  //   await page.locator("[data-rowindex='1'] [data-testid='StarIcon']").click();
//   await favouritesTab.click();

//   await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("0–1 of 1");
//   expect((await page.locator("[data-rowindex]").all()).length).toBe(1);
//   expect((await page.locator("[data-rowindex]", { hasText:"Hybrid" }).all()).length).toBe(1);
});

test("Dialog", () => {

});
 

//   const DataGridColumnLocator = (text: string) => page.locator(".MuiDataGrid-columnHeader", { hasText: text });

//   await page.goto('http://localhost:3000/');

//   await expect(page.getByText('Bills')).toBeVisible();
//   await expect(page.getByText('Enabling filtering...')).toBeVisible();

//   // You see 1 tab
//   await expect(page.locator("h1", { hasText: 'Bills' })).toBeVisible();
//   await expect(page.getByText('Favourites')).toBeHidden();

//   // columns
//   await expect(DataGridColumnLocator('Favourite')).toBeVisible();
//   await expect(DataGridColumnLocator('Bill No')).toBeVisible();
//   await expect(DataGridColumnLocator('Type')).toBeVisible();
//   await expect(DataGridColumnLocator('Status')).toBeVisible();
//   await expect(DataGridColumnLocator('Sponsors')).toBeVisible();

//   const TypeColumn =  DataGridColumnLocator('Type');
//   await expect(TypeColumn).toBeVisible();
//   await TypeColumn.hover();
//   await DataGridColumnLocator('Type').locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeSmall").click();

//   const menu = page.locator(".MuiDataGrid-menu");
//   await expect(menu).toBeVisible();

//   await expect(page.locator(".MuiDataGrid-menu")).toBeVisible();
//   expect(menu.locator(".MuiButtonBase-root", {hasText: "Filter"})).toBeHidden();

//   await page.waitForLoadState('networkidle'); // prefetch complete
 
//   await expect(menu.locator(".MuiButtonBase-root", {hasText: "Filter"})).toBeVisible();
//   await expect(page.getByText('Enabling filtering...')).toBeHidden();
//   await expect(page.locator("h1", { hasText: 'Bills' })).toBeVisible();

//   const favouritesTab = page.locator(".MuiTab-root", { hasText: "Favourites" });
//   await expect(favouritesTab).toBeVisible();
//   await favouritesTab.click();

//   await expect(DataGridColumnLocator('Favourite')).toBeHidden();
//   await expect(DataGridColumnLocator('Bill No')).toBeVisible();
//   await expect(DataGridColumnLocator('Type')).toBeVisible();
//   await expect(DataGridColumnLocator('Status')).toBeVisible();
//   await expect(DataGridColumnLocator('Sponsors')).toBeVisible();

//   // no favourites
//   await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("0–0 of 0");

//   // test favourites
  
//   // test pagination

//   await page.route('http://localhost:3000/legislation?**', async route => {

//     const queryUrl = route.request().url();
//     if (queryUrl.includes("skip=0") && queryUrl.includes("limit=10") && !queryUrl.includes("bill_type")) {
//        route.fulfill({ json: mockedLegsislations_pageSize10_page1 });
//     }
//     if (queryUrl.includes("skip=10") && queryUrl.includes("limit=10") && !queryUrl.includes("bill_type")) {
//       route.fulfill({ json: mockedLegsislations_pageSize10_page2 });
//     }
//     if (queryUrl.includes("skip=20") && queryUrl.includes("limit=10") && !queryUrl.includes("bill_type")) {
//      route.fulfill({ json: mockedLegsislations_pageSize10_page3 });
//     }
//     if (queryUrl.includes("skip=0") && queryUrl.includes("limit=10") && queryUrl.includes("bill_type=hy")) {
//       route.fulfill({ json: hybridLegislationsMock });
//      }
//   });

//   `await page.locator(".MuiTab-root", { hasText: "All" }).click();
//   await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("1–10 of 25");
//   await page.getByTitle("Go to next page").click();
//   await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("11–20 of 25");
//   await page.getByTitle("Go to previous page").click();
//   await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("1–10 of 25");

//   // enter filter
//   await TypeColumn.hover();
//   await DataGridColumnLocator('Type').locator(".MuiSvgIcon-root.MuiSvgIcon-fontSizeSmall").click();
//   await menu.locator(".MuiButtonBase-root", {hasText: "Filter"}).click();
//   page.getByPlaceholder("Filter value").fill("hy");

//   await expect(page.locator(".MuiTablePagination-displayedRows")).toHaveText("1–2 of 2");
//   expect((await page.locator("[data-rowindex]").all()).length).toBe(2);
//   expect((await page.locator("[data-rowindex]", { hasText:"Hybrid" }).all()).length).`toBe(2);

//   // favourite









  




// });
