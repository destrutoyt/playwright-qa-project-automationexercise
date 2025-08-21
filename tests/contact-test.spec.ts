import { test, expect } from '@playwright/test'
import { UserLogin } from '../page-objects/Login'
import { LoginTypes } from '../utils/types'
import loginData from '../utils/fixtures/loginData.json'


const login: LoginTypes = structuredClone(loginData)

test.beforeEach(async ({ page }) => {
    const userLogin = new UserLogin(page)
    await userLogin.autoLogin() // Uses predefined credentials from loginData.json. Manual login with provided credentials is available.
    await page.goto('/contact_us')
})

test('@CONTACT - Contact Us form submission', async ({ page }) => {
    await page.fill('[data-qa="name"]', 'John Doe')
    await page.fill('[data-qa="email"]', login.email)
    await page.fill('[data-qa="subject"]', 'Test Subject')
    await page.fill('[data-qa="message"]', 'This is a test message for the Contact Us form.')

    // Validates popup message
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Press OK to proceed!')
        await dialog.accept()
    })

    await page.click('[data-qa="submit-button"]')

    // Validates form submission
    expect (page.locator('.status.alert.alert-success')).toBeVisible()
})