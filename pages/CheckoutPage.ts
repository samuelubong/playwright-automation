import { Locator, Page } from '@playwright/test';
import { CustomerInfo } from '../test-data/ui/checkoutData';
import { parsePrice } from '../utils/priceCalculator';
import { CartItemList } from './components/CartItemList';

/**
 * Covers the three checkout steps:
 * Your Information -> Overview -> Complete.
 */
export class CheckoutPage {
  // Step 1: customer information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  // Step 2: overview
  readonly overviewItems: CartItemList;
  readonly itemTotalLabel: Locator;
  readonly finishButton: Locator;

  // Step 3: confirmation
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');

    this.overviewItems = new CartItemList(page);
    this.itemTotalLabel = page.getByTestId('subtotal-label');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
  }

  async enterCustomerInfo(customer: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async getDisplayedItemTotal(): Promise<number> {
    return parsePrice(await this.itemTotalLabel.innerText());
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }
}
