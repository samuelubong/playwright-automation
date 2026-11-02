import { Locator, Page } from '@playwright/test';
import { parsePrice } from '../../utils/priceCalculator';

/**
 * The list of selected items shown on both the Cart page
 * and the Checkout Overview page. Shared here so the locators live in one place.
 */
export class CartItemList {
  readonly items: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = this.items.getByTestId('inventory-item-name');
  }

  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async getItemPrice(productName: string): Promise<number> {
    const priceText = await this.item(productName).getByTestId('inventory-item-price').innerText();
    return parsePrice(priceText);
  }

  async getItemPrices(productNames: string[]): Promise<number[]> {
    const prices: number[] = [];
    for (const productName of productNames) {
      prices.push(await this.getItemPrice(productName));
    }
    return prices;
  }
}
