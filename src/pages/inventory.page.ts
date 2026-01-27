import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Inventory/Products Page Object
 * Handles all interactions with the product listing page
 */
export class InventoryPage extends BasePage {
  protected readonly pageUrl = '/inventory.html';
  protected readonly pageTitle = 'Products';

  // Locators
  private readonly pageHeader: Locator;
  private readonly inventoryContainer: Locator;
  private readonly inventoryItems: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly resetAppStateLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly closeMenuButton: Locator;
  private readonly burgerMenu: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;
  

  constructor(page: Page) {
    super(page);
    this.pageHeader = this.getElement('title');
    this.inventoryContainer = this.getElement('inventory-container');
    this.inventoryItems = this.getElement('inventory-item');
    this.logoutLink = this.getElement('logout-sidebar-link');
    this.resetAppStateLink = this.getElement('reset-sidebar-link');
    this.allItemsLink = this.getElement('inventory-sidebar-link');
    this.aboutLink = this.getElement('about-sidebar-link');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.burgerMenu = page.locator('.bm-menu-wrap');
    this.shoppingCartBadge = this.getElement('shopping-cart-badge');
    this.shoppingCartLink = this.getElement('shopping-cart-link');
  }

  /**
   * Check if inventory page is displayed
   */
  async isDisplayed() {
    return await this.inventoryContainer.isVisible();
  }

  /**
   * Get page header text
   */
  async getPageHeader() {
    return await this.getElementText(this.pageHeader);
  }

  /**
   * Get all inventory items count
   */
  async getInventoryItemsCount() {
    console.log(this.inventoryItems);
    return await this.inventoryItems.count();
  }

  /**
   * Get all product names
   */
  async getAllProductNames() {
    const names: string[] = [];
    const items = await this.inventoryItems.all();
    for (const item of items) {
      const nameElement = item.getByTestId('inventory-item-name');
      names.push(await nameElement.innerText());
    }
    return names;
  }

  /**
   * Get all product prices
   */
  async getAllProductPrices() {
    const prices: number[] = [];
    const items = await this.inventoryItems.all();
    for (const item of items) {
      const priceElement = item.getByTestId('inventory-item-price');
      const priceText = await priceElement.innerText();
      prices.push(parseFloat(priceText.replace('$', '')));
    }
    return prices;
  }

  /**
   * Get a random product item
   */
  async getRandomProduct(){
    const items = await this.inventoryItems.all();
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  /**
   * Get product attributes by product locator
   */
  async getProductAttributes(product: Locator) {
    const nameElement = await product.getByTestId('inventory-item-name').innerText();
    const priceElement = await product.getByTestId('inventory-item-price').innerText();
    const descriptionElement = await product.getByTestId('inventory-item-desc').innerText();

    return {
      name: nameElement,
      price: parseFloat(priceElement.replace('$', '')),
      description: descriptionElement
    };
  }

  /**
   * Add product to cart by locator
   */
  private async addProductToCart(product: Locator) {
    const addToCartButton = product.getByRole('button', { name: 'Add to cart' });
    await addToCartButton.click();
    return product;
  }

  /** 
   * Add a random product to cart
   */
  async addRandomProductToCart(){
    const product = await this.getRandomProduct();
    return await this.addProductToCart(product);
  }

  /**
   * Add product to cart by index
   */
  async addProductToCartByIndex(index: number){
    const product = this.inventoryItems.nth(index);
    return await this.addProductToCart(product);
  }

  /**
   * Add multiple random products to cart
   */
  async addRandomProductsToCart(count: number){
    const addedProducts = new Set<number>();
    const items = await this.inventoryItems.all();
    while (addedProducts.size < count && addedProducts.size < items.length) {
      const randomIndex = Math.floor(Math.random() * items.length);
      if (!addedProducts.has(randomIndex)) {
        const product = items[randomIndex];
        const addToCartButton = product.getByRole('button', { name: 'Add to cart' });
        await addToCartButton.click();
        addedProducts.add(randomIndex);
      }
    }
  }

  /**
   * Remove product from cart by locator
   */
  async removeProductFromCart(locator: Locator){
    const removeButton = locator.getByRole('button', { name: 'Remove' });
    await removeButton.click();
  }

  /**
   * Navigate to product details page by clicking on product name
   */
  async goToProductDetails(locator: Locator){
    const titleLink = locator.getByTestId('inventory-item-name');
    await titleLink.click();
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

  /**
   * Click on shopping cart
   */
  async goToCart(){
    await this.shoppingCartLink.click();
  }

  /**
   * Open burger menu
   */
  async openMenu(){
    await this.burgerMenuButton.click();
    await this.burgerMenu.waitFor({ state: 'visible' });
  }

  /**
   * Close burger menu
   */
  async closeMenu() {
    await this.closeMenuButton.click();
    await this.burgerMenu.waitFor({ state: 'hidden' });
  }


  /**
   * Logout from the application
   */
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  /**
   * Verify inventory page is loaded
   */
  async verifyPageLoaded(){
    await expect(this.pageHeader).toBeVisible();
    await expect(this.inventoryContainer).toBeVisible();
  }

  /**
   * Reset app state
   */
  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenu();
  }
}
