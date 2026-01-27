import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ENV } from '../utils/env';

/**
 * Login Page Object
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
  protected readonly pageUrl = '/';
  protected readonly pageTitle = 'Swag Labs';

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.getElement('username');
    this.passwordInput = this.getElement('password');
    this.loginButton = this.getElement('login-button');
    this.errorMessage = this.getElement('error');
    this.errorButton = this.getElement('error-button');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto(ENV.BASE_URL);
    await this.waitForPageLoad();
  }

  /**
   * Check if login page is displayed
   */
  async isDisplayed() {
    return await this.loginButton.isVisible();
  }

  /**
   * Enter username
   */
  async enterUsername(username: string) {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string) {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Login with credentials
   */
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }


  /**
   * Login with standard user
   */
  async loginStandardUser() {
    await this.login(ENV.STANDARD_USER, ENV.STANDARD_PASSWORD);
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Close error message
   */
  async closeError() {
    if (await this.errorButton.isVisible()) {
      await this.errorButton.click();
    }
  }

}
