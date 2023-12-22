import { test, expect } from '@playwright/test';
import { 
  mockedLegsislations_pageSize10_page1,
  mockedLegsislations_pageSize10_page2,
  mockedLegsislations_pageSize10_page3,
  hybridLegislationsMock,
  favourites
 } from "./mocks";
 
 // TODO: would be good to split all that in test steps
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
   const pageCountsIndicator = page.locator(".MuiTablePagination-displayedRows");
   const rowsLocator = page.locator("[data-rowindex]");
   const rowLocator = (rowNumber: number ) => page.locator(`[data-rowindex='${rowNumber}']`);
   const rowsWithText = ( textStr: string) =>  page.locator("[data-rowindex]", { hasText: textStr });
   const nextButton = page.getByTitle("Go to next page");
   const prevButton = page.getByTitle("Go to previous page");
   const EnglishTab = page.locator(".MuiTab-root", { hasText: "English" });
   const GalelicTab = page.locator(".MuiTab-root", { hasText: "Gaelic" });
   const billDetailsTab = (rowNumber: number) => page.locator(`#bill-details-${rowNumber}`);

   // queries
   const queryNoFilter = (queryUrl: string, skip: number, limit: number) => queryUrl.includes(`skip=${skip}`) 
    && queryUrl.includes(`limit=${limit}`) && !queryUrl.includes("bill_type");
  const queryWithFilter = (queryUrl: string, skip: number, limit: number, filterStr: string) => queryUrl.includes(`skip=${skip}`) 
    && queryUrl.includes(`limit=${limit}`) && queryUrl.includes(`bill_type=${filterStr}`);

 
   await page.goto('http://localhost:3000/');
 
   // Header
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
 
   await page.waitForLoadState('networkidle'); // prefetch is done, filtering should be on
  
   // Filtering should be ON
   await expect(filterMenuItem).toBeVisible();
   await expect(infoMessage).toBeHidden();
   await expect(header).toBeVisible();

  // We should see Favourites tab too, so mock favourites request
   await page.route('http://*/favourites**', async route => {
      route.fulfill({ json: favourites});
   });
 
   // Favourites tab
   await expect(favouritesTab).toBeVisible();
   await favouritesTab.click();

   // it loads favourites data
   await expect(pageCountsIndicator).toHaveText(`1–${favourites.count} of ${favourites.count}`); 
 
   // favourites columns
   await expect(DataGridColumnLocator('Favourite')).toBeHidden();
   await expect(DataGridColumnLocator('Bill No')).toBeVisible();
   await expect(DataGridColumnLocator('Type')).toBeVisible();
   await expect(DataGridColumnLocator('Status')).toBeVisible();
   await expect(DataGridColumnLocator('Sponsors')).toBeVisible();

   // Prepare for pagination on all tab
   await page.route('http://*/legislation?**', async route => {

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

   // Prepare for favourites change
   let count = 0;
   await page.route('http://*/favourite**', async route => {

    const requestMethod = route.request().method();
    if (requestMethod === "POST") {
        const { billId, isFavourite} = route.request().postDataJSON();
        if (count === 0) {
          expect(billId).toBe(mockedLegsislations_pageSize10_page1.items[5].id);
          expect(isFavourite).toBe(true);
        };
        if (count === 1) {
          expect(billId).toBe(mockedLegsislations_pageSize10_page1.items[4].id);
          expect(isFavourite).toBe(false);
        }
        route.fulfill({ json: {  billId, isFavourite }});

    };
  });

  // perform all this in All tab
  await allTabTab.click();

  // pagination
  await expect(pageCountsIndicator).toHaveText("1–10 of 25");
  await nextButton.click(); // next
  await expect(pageCountsIndicator).toHaveText("11–20 of 25");
  await prevButton.click(); //back
  await expect(pageCountsIndicator).toHaveText("1–10 of 25");

  // set favourites
  await rowLocator(5).locator(".MuiSvgIcon-root").click();
  count++;
  await rowLocator(4).locator(".MuiSvgIcon-root").click();

  // enter filter
  await TypeColumn.hover();
  await typeColumnMenuLocator.click();
  await filterMenuItem.click();
  await filterEntry.fill("hy");

  await expect(pageCountsIndicator).toHaveText("1–2 of 2");
  expect((await rowsLocator.all()).length).toBe(2);
  expect((await rowsWithText("Hybrid").all()).length).toBe(2);

  // check Dialog
   await rowLocator(0).click();
   await expect(page.getByText("Title of Bill")).toBeVisible();
   await expect(EnglishTab).toBeVisible();
   await expect(GalelicTab).toBeVisible();
   await expect(billDetailsTab(0)).toHaveText(hybridLegislationsMock.items[0].titleEn);
   await GalelicTab.click();
   await expect(billDetailsTab(1)).toHaveText(hybridLegislationsMock.items[0].titleGa);
 
  });
