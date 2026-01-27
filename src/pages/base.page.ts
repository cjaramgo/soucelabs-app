import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class
 * Provides common functionality for all page objects
 */
export class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * get element by test ID
     */
    getElement(testId: string) {
        return this.page.getByTestId(testId);
    }

    /**
     * fill input field
     */
    async fillInput(element: Locator, value: string) {
        await element.clear();
        await element.fill(value);
    }

    /**
     * get element text
     */
    async getElementText(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        return await locator.innerText();
    }

    /**
     * Wait for the page to be loaded
     */
    async waitForPageLoad(){
        await this.page.waitForLoadState('domcontentloaded');
    }
    
}