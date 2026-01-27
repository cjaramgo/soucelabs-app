import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Product Detail Page Object
 * Handles all interactions with individual product pages
 */
export class ProductDetailPage extends BasePage {
  protected readonly pageUrl = '/inventory-item.html';

  // Locators
  private readonly backButton: Locator;
  private readonly productName: Locator;
  private readonly productDescription: Locator;
  private readonly productPrice: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = this.getElement('back-to-products');
    this.productName = this.getElement('inventory-item-name');
    this.productDescription = this.getElement('inventory-item-desc');
    this.productPrice = this.getElement('inventory-item-price');
    this.addToCartButton = this.getElement('add-to-cart');
    this.removeButton = this.getElement('remove');
    this.shoppingCartBadge = this.getElement('shopping-cart-badge');
  }

  /**
   * Check if product detail page is displayed
   */
  async isDisplayed() {
    return await this.productName.isVisible();
  }

  /**
   * Get product name
   */
  async getProductName() {
    return await this.getElementText(this.productName);
  }

  /**
   * Get product description
   */
  async getProductDescription(){
    return await this.getElementText(this.productDescription);
  }

  /**
   * Get product price
   */
  async getProductPrice(){
    const priceText = await this.getElementText(this.productPrice);
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Add product to cart
   */
  async addToCart() {
    await this.addToCartButton.click();
  }

  /**
   * Remove product from cart
   */
  async removeFromCart() {
    await this.removeButton.click();
  }

  /**
   * Go back to products page
   */
  async goBackToProducts() {
    await this.backButton.click();
  }

  /**
   * Get cart item count
   */
  async getCartItemCount() {
    if (await this.shoppingCartBadge.isVisible()) {
      const countText = await this.shoppingCartBadge.innerText();
      return parseInt(countText, 10);
    }
    return 0;
  }
}
