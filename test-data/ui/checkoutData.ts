export interface UserCredentials {
  username: string;
  password: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const standardUser: UserCredentials = {
  username: process.env.SAUCE_USERNAME ?? 'standard_user',
  password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
};

export const productsToPurchase: string[] = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

export const customerInfo: CustomerInfo = {
  firstName: 'Samuel',
  lastName: 'Ubong',
  postalCode: '10001',
};

export const expectedMessages = {
  inventoryTitle: 'Products',
  orderComplete: 'Thank you for your order!',
};
