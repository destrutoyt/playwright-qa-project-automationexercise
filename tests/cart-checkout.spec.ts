import { test, expect } from '@playwright/test'
import { UserLogin } from '../page-objects/Login'
import { ProductTypes } from '../utils/types/productTypes'
import products from '../utils/fixtures/productData.json'

const productData: ProductTypes[] = products.products

test.beforeEach(async ({ page }) => {
	const userLogin = new UserLogin(page)
	await userLogin.autoLogin() // Uses predefined credentials from loginData.json. Manual login with provided credentials is available.
	await page.goto('/products')
})

test.only('@CART - Add product to cart and validate it', async ({ page }) => {
	
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