import { toPlaywrightReport } from "./Annotations";
import { sendAlertMessage } from "./bot";

export async function loginWithValidUsername_identity(page, baseURL, username, password, testName) { //uses /identity/ instead of /auth/
    page.setDefaultTimeout(30000);

    const { expect } = require("@playwright/test");
    // Navigate to the login page of the web application
    await page.goto(baseURL + "/identity/login", {
        waitUntil: "networkidle",
    });

    const loginUsernameApi = baseURL + "/identity/api/login/lookup"

    try {
        // Fill in the username field with the corresponding value from the configuration file
        await page.waitForSelector("#username");
        await page.click("#username");
        await page.fill("#username", username);

        // Click on the next button and wait for a response from the server
        await page.locator('//*[@id="app"]/main/section/div/div/div/form/div[2]/button').click();
        const response = await page.waitForResponse(res => res.url().startsWith(loginUsernameApi));
        let statusCode = response.status();

        if (statusCode < 200 || statusCode > 299) {
            throw new Error(`${testName} - Authentication (identity auth) - Invalid username`);
        }
    } catch (error) {
        let message = `${testName} - Authentication (identity auth) - Invalid username`
        console.log(message);
        await toPlaywrightReport(message);
        await sendAlertMessage(message);
        return -1;
    }

    const passwordApi = baseURL + "/identity/api/login/password"

    try {
        await page.locator('//*[@id="password"]').click()
        await page.locator('//*[@id="password"]').fill(password); //click password element and fill.
        await page.locator('//*[@id="app"]/main/section/div/div/div/form/div[2]').click();
        const response = await page.waitForResponse(res => res.url().startsWith(passwordApi));
        let statusCode = response.status();

        if (statusCode < 200 || statusCode > 299) {
            throw new Error(`${testName} - Authentication (identity auth) - Invalid Password`);
        }
    } catch (error) {
        let message = `${testName} - Authentication (identity auth) - Invalid Password`
        console.log(message);
        await toPlaywrightReport(message);
        await sendAlertMessage(message);
        return -1;
    }

    try {
        const message = `${testName} - Authentication (identity auth) - Logged in successfully`;
        console.log(message);
        await toPlaywrightReport(message);
        await page.waitForLoadState("networkidle", { timeout: 30000 });
        await page.waitForTimeout(2000);
        await page.waitForLoadState("networkidle");
        let domain = new URL(baseURL).hostname;
        const urlPattern = new RegExp(`.*${domain}`);
        await expect(page).toHaveURL(urlPattern);
        await page.getByRole("navigation", { name: "Portfolio" }).click();
        await page.waitForLoadState("networkidle");
        return 0;
    } catch (error) {
        console.log(error);
        let message = `${testName} - Authentication (identity auth)- Web content not loaded properly`
        console.log(message);
        await sendAlertMessage(message);
        await toPlaywrightReport(message);
        return -1;
    }
}
