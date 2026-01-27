import { authenticatedTest as test, expect } from '../fixtures/auth-fixtures';
import { ENV } from '../utils/env';

/**
 * Shopping Cart Management Tests
 * This suite tests adding and removing items from the shopping cart,
 * verifying cart contents, and ensuring cart state persists across navigation and page reloads.
 */

test.beforeEach(async ({ inventoryPage, page }) => {
  // Navigate to inventory page before each test
  await page.goto(`${ENV.BASE_URL}/inventory.html`);
  await inventoryPage.verifyPageLoaded();
});

test.describe('Adding Items to Cart', () => {
  test('should add single item to cart from inventory page', async ({ inventoryPage, page }) => {

    // Initial cart should be empty
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);

    // Add item
    await inventoryPage.addRandomProductToCart();

    // Verify cart updated
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should add multiple different items to cart', async ({ inventoryPage, page }) => {

    // Initial cart should be empty
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);

    // Add multiple items
    await inventoryPage.addRandomProductsToCart(3);

    // Verify cart updated
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);

  });

  test('should add item from product detail page', async ({ inventoryPage, productDetailPage, page }) => {
    // Get a random product and navigate to its detail page
    const product = await inventoryPage.getRandomProduct();
    await inventoryPage.goToProductDetails(product);

    // Verify on product detail page
    expect(await productDetailPage.isDisplayed()).toBe(true);

    // Add to cart from detail page
    await productDetailPage.addToCart();

    // Verify cart updated
    const cartCount = await productDetailPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should display correct product details in Product Details', async ({ inventoryPage, productDetailPage, page }) => {

    // Add a random product to cart
    const product = await inventoryPage.addRandomProductToCart();
    const productDetails = await inventoryPage.getProductAttributes(product);

    // Navigate to product detail page
    await inventoryPage.goToProductDetails(product);

    // verify product in Product Details
    expect(await productDetailPage.getProductName()).toBe(productDetails.name);
    expect(await productDetailPage.getProductPrice()).toBe(productDetails.price);
    expect(await productDetailPage.getProductDescription()).toBe(productDetails.description);
  });
});

test.describe('Removing Items from Cart', () => {
  test('should remove item from inventory page', async ({ inventoryPage, page }) => {
    // Add item
    const product = await inventoryPage.addRandomProductToCart();
    expect(await inventoryPage.getCartItemCount()).toBe(1);

    // Remove item
    await inventoryPage.removeProductFromCart(product);

    // Verify cart is empty
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });

  test('should remove item from product detail page', async ({ inventoryPage, productDetailPage, page }) => {
    // Add item from inventory
    const product = await inventoryPage.addRandomProductToCart();

    // Go to product detail
    await inventoryPage.goToProductDetails(product);

    // Remove from detail page
    await productDetailPage.removeFromCart();

    // Verify cart empty
    expect(await productDetailPage.getCartItemCount()).toBe(0);
  });

});

test.describe('Cart Persistence', () => {
  test('should persist cart items after page navigation', async ({ inventoryPage, productDetailPage, page }) => {
    // Add items
    const item1 = await inventoryPage.addProductToCartByIndex(0);
    const item2 = await inventoryPage.addProductToCartByIndex(1);

    // Navigate to product detail
    await inventoryPage.goToProductDetails(item1);

    // Cart should still show 2 items
    expect(await productDetailPage.getCartItemCount()).toBe(2);

    // Go back to products
    await productDetailPage.goBackToProducts();

    // Cart should still show 2 items
    expect(await inventoryPage.getCartItemCount()).toBe(2);
  });

  test('should persist cart items after page refresh', async ({ inventoryPage, page }) => {
    // Add items
    await inventoryPage.addRandomProductToCart();
    const initialCount = await inventoryPage.getCartItemCount();

    // Refresh page
    await page.reload();
    await inventoryPage.verifyPageLoaded();

    // Cart should persist
    const afterRefreshCount = await inventoryPage.getCartItemCount();
    expect(afterRefreshCount).toBe(initialCount);
  });
});

test.describe('Reset App State', () => {
  test('should clear cart when app state is reset', async ({ inventoryPage, page }) => {
    // Add items
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.addProductToCartByIndex(1);
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    // Reset app state
    await inventoryPage.resetAppState();

    // Cart should be empty
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });
});