import { test, expect } from '@playwright/test'
import { UserLogin } from '../page-objects/Login'
import { ProductFiltering } from '../page-objects/ProductFiltering'
import { ProductTypes } from '../utils/types/productTypes'
import products from '../utils/fixtures/productData.json'

const productData: ProductTypes[] = products.products

test.beforeEach(async ({ page }) => {
	const userLogin = new UserLogin(page)
	await userLogin.autoLogin() // Uses predefined credentials from loginData.json. Manual login with provided credentials is available.
	await page.goto('/products')
})

test('@PRODUCT - Search product by name', async ({ page }) => {
	// Validates that user is logged in
	await expect(page.getByText('Logged in as John Doe')).toBeVisible()

	// Search for a product
	await page.locator('[placeholder="Search Product"]').fill('Men Tshirt')
	await page.click('#submit_search')

	// Validates that product is displayed
	await expect(page.locator('.productinfo p')).toHaveText('Men Tshirt')
})
test('@PRODUCT - Search multiple products by name', async ({ page }) => {
	// Validates that user is logged in
	await expect(page.getByText('Logged in as John Doe')).toBeVisible()

	// Search for multiple products
	for (const product of productData) {
		await page.locator('[placeholder="Search Product"]').fill(product.name)
		await page.click('#submit_search')
		await expect(page.locator('.productinfo p')).toHaveText(product.name)
	}
})
test('@PRODUCT - Filter products by category', async ({ page }) => {
	const productFiltering = new ProductFiltering(page)

	// Filter by Women
	await productFiltering.filterByCategory('Women', ['Dress', 'Tops', 'Saree'])
	// Filter by Men
	await productFiltering.filterByCategory('Men', ['Tshirts', 'Jeans'])
	// Filter by Kids
	await productFiltering.filterByCategory('Kids', ['Dress', 'Tops & Shirts'])
})
test('@PRODUCT - Filter products by brand', async ({ page }) => {
	const productFiltering = new ProductFiltering(page)

	// Filter by Brands
	await productFiltering.filterByBrands([
		'Polo',
		'H&M',
		'Madame',
		'Mast & Harbour',
		'Babyhug',
		'Allen Solly Junior',
		'Kookie Kids',
		'Biba',
	])
})
test('@PRODUCT - Verify accurate product previews', async ({ page }) => {
	for (const product of productData) {
		await page.click(`[href="${product.detailsUrl}"]`)
		await expect(page.getByText(product.name, { exact: true })).toBeVisible()
		await expect(page.getByText(`Category: ${product.category}`, { exact: true })).toBeVisible()
		await expect(page.getByText(product.price, { exact: true })).toBeVisible()
		await expect(page.getByText(`Availability: ${product.availability}`, { exact: true })).toBeVisible()
		await expect(page.getByText(`Condition: ${product.condition}`, { exact: true })).toBeVisible()
		await expect(page.getByText(`Brand: ${product.brand}`, { exact: true })).toBeVisible()
		await page.goBack()
	}
})