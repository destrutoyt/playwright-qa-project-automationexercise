import { test, expect } from '@playwright/test'
import { UserLogin } from '../page-objects/Login'
import { RegistrationTypes, ProductTypes } from '../utils/types/'
import products from '../utils/fixtures/productData.json'
import registrationData from '../utils/fixtures/registrationData.json'
import { AddressValidation } from '../page-objects/AddressValidation'


export const productData: ProductTypes[] = products.products
export const userData: RegistrationTypes = structuredClone(registrationData)

test.beforeEach(async ({ page }) => {
	const userLogin = new UserLogin(page)
	await userLogin.autoLogin() // Uses predefined credentials from loginData.json. Manual login with provided credentials is available.
	await page.goto('/products')
})

test('@CART - Add product to cart and validate it', async ({ page }) => {
	
    const cartTable = page.locator('#cart_info_table tbody');
    let productID : number = productData[0].id;
    console.log(productID)

    // Add X product to the cart and verify confirmation msg
    await page.click(`[data-product-id="${productID}"]`)
    await expect(page.locator('.modal-content .modal-header h4')).toHaveText('Added!')

    // Goes to "View Cart" and confirms product is in cart
    await page.click('.modal-content a[href="/view_cart"]')
    await expect(cartTable.locator(`tr#product-${productID}`)).toBeVisible() // getByText() can cause issues if one or more items are named "Blue Top"
})
test('@CART - Checkout process', async ({ page }) => {

    // Proceed to checkout
    await page.click('a[href="/view_cart"]');
    await page.getByText("Proceed To Checkout").click();

    // Confirm address details
    // Raw Data
    const addressValidator = new AddressValidation(page);
    await addressValidator.load();

    expect(addressValidator.fullname).toBe(userData.name);
    expect(addressValidator.address1).toBe(userData.address.address);
    expect(addressValidator.address2).toBe(userData.address.address2);
    expect(addressValidator.city).toBe(userData.address.city);
    expect(addressValidator.state).toBe(userData.address.state);
    expect(addressValidator.zipcode).toBe(userData.address.zipcode);
    expect(addressValidator.country).toBe(userData.address.country);
    expect(addressValidator.mobileNumber).toBe(userData.address.mobile_number);

    // Validate order
    const cartTable = page.locator('#cart_info tbody');
    let productID : number = productData[0].id;
    await expect(cartTable.locator(`tr#product-${productID}`)).toBeVisible() // getByText() can cause issues if one or more items are named "Blue Top"

    // Place order
    await page.getByText("Place Order").click();

    // Insert card details
    await page.fill('[data-qa="name-on-card"]', userData.name);
    await page.fill('[data-qa="card-number"]', '4111111111111111');
    await page.fill('[data-qa="expiry-month"]', '12');
    await page.fill('[data-qa="expiry-year"]', '2025');
    await page.fill('[data-qa="cvc"]', '123');

    // Submit order
    await page.click('[data-qa="pay-button"]');

    // Wait for URL to load and validates
    await page.waitForURL('https://automationexercise.com/payment_done/500');

    // Validates order placement
    expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
})