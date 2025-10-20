import { test, expect } from '@playwright/test'
import { UserLogin } from '../page-objects/Login'
import { UserDataTypes, ProductTypes } from '../utils/types/'
import { AddressValidation } from '../page-objects/AddressValidation'

import products from '../utils/fixtures/productData.json'
import data from '../utils/fixtures/userData.json'

export const productData: ProductTypes[] = products.products
export const userData: UserDataTypes = structuredClone(data)

test.beforeEach(async ({ page }) => {
	const userLogin = new UserLogin(page)
	await userLogin.autoLogin() // Uses predefined credentials from userData.json. Manual login with provided credentials is available.
	await page.goto('/products')
})

test('@CART - Add product to cart and validate it', async ({ page }) => {
	const cartTable = page.locator('#cart_info_table tbody')
	let productID: number = productData[0].id
	console.log(productID)

	// Add X product to the cart and verify confirmation msg
	await page.click(`[data-product-id="${productID}"]`)
	await expect(page.locator('.modal-content .modal-header h4')).toHaveText(
		'Added!',
	)

	// Goes to "View Cart" and confirms product is in cart
	await page.click('.modal-content a[href="/view_cart"]')
	await expect(cartTable.locator(`tr#product-${productID}`)).toBeVisible() // getByText() can cause issues if one or more items are named "Blue Top"
})
test('@CART - Checkout process', async ({ page }) => {
	// Proceed to checkout
	await page.click('a[href="/view_cart"]')
	await page.getByText('Proceed To Checkout').click()

	// Confirm address details
	// Raw Data
	const addressValidator = new AddressValidation(page)
	await addressValidator.load()

	expect(addressValidator.fullname).toBe(userData.first_name + ' ' + userData.last_name) // Added first_name and last_name instead of name due to API limitation (see api-handling.spec.ts for more info)
	expect(addressValidator.address1).toBe(userData.address1)
	expect(addressValidator.address2).toBe(userData.address2)
	expect(addressValidator.city).toBe(userData.city)
	expect(addressValidator.state).toBe(userData.state)
	expect(addressValidator.zipcode).toBe(userData.zipcode)
	expect(addressValidator.country).toBe(userData.country)
	expect(addressValidator.mobileNumber).toBe(userData.mobile_number)

	// Validate order
	const cartTable = page.locator('#cart_info tbody')
	let productID: number = productData[0].id
	await expect(cartTable.locator(`tr#product-${productID}`)).toBeVisible() // getByText() can cause issues if one or more items are named "Blue Top"

	// Place order
	await page.getByText('Place Order').click()

	// Insert card details
	await page.fill('[data-qa="name-on-card"]', userData.name)
	await page.fill('[data-qa="card-number"]', '4111111111111111')
	await page.fill('[data-qa="expiry-month"]', '12')
	await page.fill('[data-qa="expiry-year"]', '2025')
	await page.fill('[data-qa="cvc"]', '123')

	// Submit order
	await page.click('[data-qa="pay-button"]')

	// Wait for URL to load and validates
	await page.waitForURL('https://automationexercise.com/payment_done/500')

	// Validates order placement
	expect(page.locator('[data-qa="order-placed"]')).toBeVisible()
})
