import { test, expect } from '@playwright/test'
import { RegistrationTypes, UserDataTypes } from '../utils/types'
import registrationData from '../utils/fixtures/registrationData.json'
import data from '../utils/fixtures/userData.json'

// Registration & Login data (JSON > JS object)
const userData: UserDataTypes = structuredClone(data)
const registerData: RegistrationTypes = structuredClone(registrationData)

test('@AUTH - Register a new user', async ({ page }) => {
	// Navigate to the registration page
	await page.goto('/login')

	// Fill in the registration form
	await page.fill('[data-qa="signup-name"]', registerData.name)
	await page.fill('[data-qa="signup-email"]', registerData.email)
	await page.click('[data-qa="signup-button"]')

	if (await page.getByText('Email Address already exist!').isVisible()) {
		// Check if the account already exists
		console.log('Email already exists, proceeding to login instead.')
		test.skip()
	}

	// Expect signup form to be visible
	await page.waitForURL('/signup')
	await expect(page.locator('.login-form')).toBeVisible()

	// Fill in the account details
	await page.locator('.radio-inline').first().click() // Select Mr.
	await expect(page.locator('[data-qa="name"]')).toHaveValue(registerData.name)
	await expect(page.locator('[data-qa="email"]')).toHaveValue(
		registerData.email,
	)
	await page.fill('[data-qa="password"]', registerData.password)

	await page.locator('[data-qa="days"]').selectOption('1')
	await page.locator('[data-qa="months"]').selectOption('January')
	await page.locator('[data-qa="years"]').selectOption('1990')

	await page.locator('#newsletter').check()
	await page.locator('#optin').check()

	// Fill in address information
	await page.fill('[data-qa="first_name"]', registerData.address.first_name)
	await page.fill('[data-qa="last_name"]', registerData.address.last_name)
	// await page.fill('[data-qa="company"]', 'Example Company'); // Optional field
	await page.fill('[data-qa="address"]', registerData.address.address)
	await page.fill('[data-qa="address2"]', registerData.address.address2)
	await page
		.locator('[data-qa="country"]')
		.selectOption(registerData.address.country)
	await page.fill('[data-qa="state"]', registerData.address.state)
	await page.fill('[data-qa="city"]', registerData.address.city)
	await page.fill('[data-qa="zipcode"]', registerData.address.zipcode)
	await page.fill(
		'[data-qa="mobile_number"]',
		registerData.address.mobile_number,
	)

	await page.click('[data-qa="create-account"]')

	// Expect account creation success message
	await page.waitForTimeout(2000) // Wait for the page to load
	await expect(page.locator('[data-qa="account-created"]')).toHaveText(
		'Account Created!',
	)

	// Proceed to continue
	await page.click('[data-qa="continue-button"]')

	// Delete account (optional step)
	// await page.goto('/delete_account')
	// await expect(page.locator('[data-qa="account-deleted"]')).toHaveText('Account Deleted!')
})

test('@AUTH - Login with existing user', async ({ page }) => {
	// Navigate to the login page
	await page.goto('/login')

	// Fill in the login form
	await page.fill('[data-qa="login-email"]', data.email)
	await page.fill('[data-qa="login-password"]', data.password)
	await page.click('[data-qa="login-button"]')

	// Refreshes webpage and checks if user is logged in
	await page.reload()
	await expect(
		page.getByText('Logged in as ' + data.name),
	).toBeVisible()

	// Logout and checks if user is logged in
	await page.click('[href="/logout"]')
	await page.goto('/')
	await expect(page.getByText('Logged in as ' + data.name)).toBeHidden()
})
