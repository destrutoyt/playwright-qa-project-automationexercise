import { Page } from '@playwright/test'
import loginData from '../utils/fixtures/loginData.json'

export class UserLogin {
	private page: Page
	private emailField: string = '[data-qa="login-email"]'
	private passwordField: string = '[data-qa="login-password"]'
	private loginButton: string = '[data-qa="login-button"]'

	constructor(page: Page) {
		this.page = page
	}

	/**
	 * Automates the login process using predefined credentials.
	 * Check loginData.json for the credentials used.
	 */
	async autoLogin() {
		await this.page.goto('/login')
		await this.page.fill(this.emailField, loginData.email)
		await this.page.fill(this.passwordField, loginData.password)
		await this.page.click(this.loginButton)
		console.warn('LOGIN DATA:', loginData.email, loginData.password)
	}
	/**
	 * Logs in user using provided credentials
	 * @param email - String
	 * @param password - String
	 */
	async manualLogin(email: string, password: string) {
		await this.page.goto('/login')
		await this.page.fill(this.emailField, email)
		await this.page.fill(this.passwordField, password)
		await this.page.click(this.loginButton)
	}
}
