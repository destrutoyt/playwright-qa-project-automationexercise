# Test Plan for AutomationPractice by Miguel Garces
*Project Owner: Miguel Garces*  
*Latest Revision: 8/13/2025*

## Project Overview
This project performs end-to-end testing to the demo website [Automation Exercise](https://automationexercise.com/). It extensively covers major user flows such as login/registration, product filtering, checkout, and API functionality.

## Test Objectives
- Validate critical user flows including:
    - User login/registration.
    - Product preview.
    - Product filtering.
    - Checkout validation (Correct address, card, etc?).
    - Purchase confirmation.
    - Item visible in orders.
- Perform API testing with Postman.
- Ensure CI/CD is setup with Github Actions and tests are isolated using Docker.

## Tools & Tech
- [Playwright](https://playwright.dev/) (E2E + API Testing)
- [Postman](https://www.postman.com/)
- [Allure](https://allurereport.org/) (Reporting tool)
- Github Actions
- [Docker](https://www.docker.com/)
- Node 17+

## Test Scope

| Feature | Test Type | Status | Notes |
| --- | --- | --- | --- |
| User Registration | UI + Validation | ✅ | N/A |
| User Login/Logout | UI + Session Handling | ✅ | Check for session persistence |
| Product Search & Filters | UI | ✅ | Filter by category and other options available |
| Product Preview | UI | ✅ | Verifies product information is matches with listing |
| Add to Cart | UI + Validation | ✅ | Validates product is in the cart |
| Checkout Process | UI | 🔄 | N/A |
| Purchase Confirmation | UI + Validation | 🔄 | Ensure successful purchase and verify product is found in "Orders" |
| Contact Form | UI + Form Validation | ⏳ | N/A |
| User Login (POST) | API | ⏳ | N/A |
| Get Products (GET) | API | ⏳ | N/A |

>Icon Legend: ⏳ Not Started - 🔄 In Progress - ✅ Covered - 🚫 Out of Scope

## Test Design Approach
- Page Object Model (POM) used for reusability.
- Use of fixtures to perform Parametrized tests on edge cases.
- Test cases separated by features.
- Use of tags (`@API`, `@WEB`) for test grouping.

## Entry / Exit Criteria

**ENTRY CRITERIA**

- Website is deployed
- Docker containers are running 
- Test data or fixtures are created
- Environmental variables are set

**EXIT CRITERIA**

- All critical tests passed (See [Test Scope](#test-scope) for status information)
- No P1 or P2 bugs found
- Allure report generated
- Github Actions pipeline passed without failure

## Reporting

Reports will be automatically created by using Allure along with Playwright. Test results can also be found via Github Actions artifacts.

## Risks & Assumptions
This project is built against an external demo website designed for testing purposes only. As such, there are inherent risks and assumptions that must be taken into account:
### Risks
- **External Dependencies:** It is out of my control if the website is not available, unexpected changes, or broken endpoints. In return, this could affect the reliability and accuracy of the tests.
- **No Control Over Data**: The project contains mock data to perform login/registration tests and product searching. However, this data could be deleted or modified by the owner of the website. For example, user login may be deleted after a week or the naming of a product might change later in the future. Testers are ENCOURAGED to update test data.
- **Rate Limiting / Throttling**: Excessive requests during load or API testing may be blocked or throttled by the host server.
### Assumptions
- The website will remain publicly accessible and functional throughout the duration of the project.
- Test cases are designed based on the current structure and behavior of the site as of the time of development.
- Any limitations or restrictions of the demo site are accepted as boundaries of the current testing scope.
