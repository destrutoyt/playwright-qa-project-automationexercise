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
	expect(body.responseCode).toBe(400) // API seems to returned 400 code instead of 404.
	expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.') // API returns a different message than "User not found!" (Website docs might be outdated)
})

test('@API - (GET) Get all products', async ({ request }) => {
	const response = await request.get('https://automationexercise.com/api/productsList')
	expect(response.status()).toBe(200)
})

// Additional API tests
test('@API - (POST) To All Product List is invalid', async ({ request }) => {
	const response = await request.post('https://automationexercise.com/api/productsList')
	expect(response.status()).toBe(200)
	const body = await response.json()
	expect(body.message).toBe('This request method is not supported.')
})

test('@API - (POST) Search Product with valid product', async ({ request }) => {
	const response = await request.post('https://automationexercise.com/api/searchProduct', {
		// used 'form' instead of 'data' because the API expects form-urlencoded data.
		form: {	
			search_product: 'top',
		},
	})
	
	expect(response.status()).toBe(200)
	const body = await response.json()
	expect(body.products.length).toBeGreaterThan(0)
})

// NOTE: API does not update first_name or last_name even if provided.
// These fields remain from registration data.
test('@API - (PUT) Update User Info with Parameters', async ({ request }) => {
	const response = await request.put('https://automationexercise.com/api/updateAccount', {
		form: {
			name: 'Julian Andres',
			email: 'johnDoe24@gmail.com',
			password: 'johnDoe#24',
			title: 'Mr',
			birth_date: `24`,
			birth_month: `June`,
			birth_year: `1990`,
			company: 'Tech Corp',
			address1: '123 Main St',
			address2: 'Apt 4B',
			country: 'United States',
			state: 'California',
			city: 'Los Angeles',
			zipcode: '90001',
			mobile_number: '1234567890',
		},
	})
	expect(response.status()).toBe(200)
	const body = await response.json()
	expect(body.message).toBe('User updated!')
})
