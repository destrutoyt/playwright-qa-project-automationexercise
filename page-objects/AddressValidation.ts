import { Page, Locator } from '@playwright/test'

export class AddressValidation {
	private page: Page

	// Locators
	private fullNameLocator: Locator
	private addressLines: Locator
	private cityStateZipLocator: Locator
	private countryLocator: Locator
	private phoneLocator: Locator

	// Properties to hold normalized values
	fullname = ''
	firstName = ''
	lastName = ''
	address1 = ''
	address2 = ''
	city = ''
	state = ''
	zipcode = ''
	country = ''
	mobileNumber = ''

	constructor(page: Page) {
		this.page = page

		this.fullNameLocator = page.locator(
			'#address_delivery li.address_firstname.address_lastname',
		)
		this.addressLines = page.locator(
			'#address_delivery li.address_address1.address_address2',
		)
		this.cityStateZipLocator = page.locator(
			'#address_delivery li.address_city.address_state_name.address_postcode',
		)
		this.countryLocator = page.locator(
			'#address_delivery li.address_country_name',
		)
		this.phoneLocator = page.locator('#address_delivery li.address_phone')
	}

	/**
	 * Load and normalize address data from the page.
	 */
	async load() {
		await this.page.waitForSelector('#address_delivery')

		const fullNameRaw = (await this.fullNameLocator.textContent()) ?? ''
		this.fullname = fullNameRaw
			.replace(/^(Mr\.|Mrs\.|Miss\.|Ms\.)\s*/i, '')
			.trim()
		;[this.firstName, this.lastName] = this.fullname.split(' ')

		const address1Raw = (await this.addressLines.nth(1).textContent()) ?? ''
		const address2Raw = (await this.addressLines.nth(2).textContent()) ?? ''
		this.address1 = address1Raw.trim()
		this.address2 = address2Raw.trim()

		const cityStateZipRaw = (await this.cityStateZipLocator.textContent()) ?? ''
		const parts = cityStateZipRaw.trim().split(/\s+/)
		this.zipcode = parts.pop() ?? ''
		this.state = parts.pop() ?? ''
		this.city = parts.join(' ') ?? ''

		this.country = ((await this.countryLocator.textContent()) ?? '').trim()
		this.mobileNumber = ((await this.phoneLocator.textContent()) ?? '').trim()
	}
}
