import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { customerInfo, expectedMessages, productsToPurchase, standardUser } from '../../test-data/ui/checkoutData';
import {
  expectCartContainsOnly,
  expectItemTotalMatchesPrices,
  expectOrderConfirmed,
  expectUserLoggedIn,
} from '../../assertions/ui/checkoutAssertions';

test.describe('SauceDemo checkout', () => {
  test('standard user can buy two products and the item total matches their prices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Log in as a standard user', async () => {
      await loginPage.open();
      await loginPage.login(standardUser);
      await expectUserLoggedIn(page, inventoryPage.title, expectedMessages.inventoryTitle);
    });

    await test.step('Add products to the cart and review the cart', async () => {
      await inventoryPage.addProductsToCart(productsToPurchase);
      await inventoryPage.openCart();
      await expectCartContainsOnly(cartPage.cartItems.itemNames, productsToPurchase);
    });

    await test.step('Enter customer information and verify the item total', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.enterCustomerInfo(customerInfo);
      await checkoutPage.continueToOverview();

      const productPrices = await checkoutPage.overviewItems.getItemPrices(productsToPurchase);
      const displayedItemTotal = await checkoutPage.getDisplayedItemTotal();
      expectItemTotalMatchesPrices(displayedItemTotal, productPrices);
    });

    await test.step('Complete the order', async () => {
      await checkoutPage.finishCheckout();
      await expectOrderConfirmed(page, checkoutPage.completeHeader, expectedMessages.orderComplete);
    });
  });
});
