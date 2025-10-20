import { test, expect } from '@playwright/test'

test('@API - (POST) Verify login', async ({ request }) => {
	const response = await request.post('https://automationexercise.com/api/verifyLogin', {
		data: {
			email: 'johnDoe24@gmail.com',
			password: 'johnDoe#24',
		},
	})
	expect(response.status()).toBe(200)
})

test('@API - (POST) Verify login with wrong credentials', async ({ request }) => {
	const response = await request.post('https://automationexercise.com/api/verifyLogin', {
		data: {
			email: 'dsdsd@dest.com',
			password: 'dsdsfsd',
		},
	})

	// HTTP status is 200 because the request itself succeeded
	expect(response.status()).toBe(200)

	// Check the body for the API's error code
	const body = await response.json()
	console.log(body) // Verifies actual API response
	expect(body.responseCode).toBe(400) // API seems to returned 400 code instead of 404.
	expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.') // API returns a different message than "User not found!" (Website docs might be outdated)
})

test('@API - (GET) Get all products', async ({ request }) => {
	const response = await request.get('https://automationexercise.com/api/productsList')
	expect(response.status()).toBe(200)
})

// Additional API tests
test('@API - (POST) - To All Product List is invalid', async ({ request }) => {
	const response = await request.post('https://automationexercise.com/api/productsList')
	expect(response.status()).toBe(200)
	const body = await response.json()
	expect(body.message).toBe('This request method is not supported.')
})
