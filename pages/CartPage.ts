import { Locator, Page } from '@playwright/test';
import { CartItemList } from './components/CartItemList';

export class CartPage {
  readonly cartItems: CartItemList;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.cartItems = new CartItemList(page);
    this.checkoutButton = page.getByTestId('checkout');
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
