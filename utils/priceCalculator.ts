/**
 * Converts a price label shown in the UI into a number.
 * Examples: "$29.99" -> 29.99, "Item total: $39.98" -> 39.98
 */
export function parsePrice(priceText: string): number {
  const amount = priceText.replace(/[^0-9.]/g, '');
  const price = Number.parseFloat(amount);

  if (Number.isNaN(price)) {
    throw new Error(`Unable to parse a price from "${priceText}"`);
  }
  return price;
}

/**
 * Adds prices together and rounds to 2 decimal places
 * to avoid floating point issues (e.g. 29.99 + 9.99 = 39.980000000000004).
 */
export function calculateTotal(prices: number[]): number {
  const total = prices.reduce((sum, price) => sum + price, 0);
  return Math.round(total * 100) / 100;
}
