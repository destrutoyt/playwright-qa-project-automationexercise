import { Page } from '@playwright/test';

export class ProductFiltering {
	constructor(private page: Page) {}

    /**
     * Filters products by category and subcategories.
     * @param categoryId The ID of the category to filter.
     * @param subcategories An array of subcategory names to filter.
     */
	async filterByCategory(categoryId: string, subcategories: string[]) {
        for (const subCat of subcategories) {
            await this.page.click(`[href="#${categoryId}"]`);
            await this.page.locator(`#${categoryId} .panel-body a:has-text("${subCat}")`).waitFor({ state: 'visible' });
            await this.page.click(`#${categoryId} .panel-body a:has-text("${subCat}")`);
        }
    }
    /**
     * Filters products by brand.
     * @param brands An array of brand names to filter.
     */
    async filterByBrands(brands: string[]) {
        for (const brand of brands) {
            await this.page.click(`.brands_products a:has-text("${brand}")`);
        }
    }
}
