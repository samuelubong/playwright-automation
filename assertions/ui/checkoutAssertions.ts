import { expect, Locator, Page } from '@playwright/test';
import { calculateTotal } from '../../utils/priceCalculator';

export async function expectUserLoggedIn(page: Page, pageTitle: Locator, expectedTitle: string): Promise<void> {
  await expect(page, 'User should land on the inventory page after login').toHaveURL(/\/inventory\.html$/);
  await expect(pageTitle).toHaveText(expectedTitle);
}

export async function expectCartContainsOnly(itemNames: Locator, expectedProducts: string[]): Promise<void> {
  // toHaveText with an array checks both the count and the order of the items
  await expect(itemNames, 'Cart should list exactly the selected products').toHaveText(expectedProducts);
}

export function expectItemTotalMatchesPrices(displayedItemTotal: number, productPrices: number[]): void {
  const expectedItemTotal = calculateTotal(productPrices);
  expect(displayedItemTotal, `Item total should equal the sum of ${productPrices.join(' + ')}`).toBe(expectedItemTotal);
}

export async function expectOrderConfirmed(page: Page, completeHeader: Locator, expectedMessage: string): Promise<void> {
  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(completeHeader).toHaveText(expectedMessage);
}
