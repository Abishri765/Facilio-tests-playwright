import { toPlaywrightReport } from "../../utils/Annotations";
import { sendAlertMessage } from "../../utils/bot";

export async function createWorkorder(page, baseURL, testName) {
    const { expect } = require("@playwright/test");
    page.setDefaultTimeout(30000);
    const workorderListApi = `${baseURL}/newapp/api/v3/modules/workorder/view/all`
    try {
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle');
        await page.getByRole('link', { name: 'Maintenance' }).click();
        const response = await page.waitForResponse(res => res.url().startsWith(workorderListApi));
        const responseStatus = response.status();
        if (responseStatus < 200 || responseStatus > 299) {
            let message = `${testName} - Create Workorder - Response status code not successfull : ${responseStatus}`;
            console.error(message);
            await sendAlertMessage(message);
            await toPlaywrightReport(message);
        }
        else {
            let message = `${testName} - workorder - workorder list page working`;
            console.log(message);
            await toPlaywrightReport(message);
        }
    } catch (error) {
        console.error(error);
        let message = `${testName} - workorder - cannot find API: ${workorderListApi}`;
        console.error(message);
        await sendAlertMessage(message);
        message = JSON.stringify(message);
        await toPlaywrightReport(message);
        return -1;
    }
    await page.waitForLoadState('networkidle');

    try {
        await page.getByRole('button', { name: 'New Work Order' }).click();
        await page.waitForLoadState('networkidle');
        await page.locator('.el-input__inner').first().click();
        await page.getByRole('listitem').filter({ hasText: 'Standard' }).click();
        await page.locator('.fc-input-full-border2 > .el-input__inner').first().click();
        await page.locator('.fc-input-full-border2 > .el-input__inner').first().fill('Test Ignore');
        await page.waitForTimeout(1000);
        await page.locator('.el-form-item__content > div > .el-select > .el-input > .el-input__inner').first().click();
        await page.getByRole('listitem').filter({ hasText: 'Yem' }).click();
        await page.getByPlaceholder('Type your  Description').click();
        await page.getByPlaceholder('Type your  Description').fill('created for testing purpose');
        await page.locator('div:nth-child(8) > .el-form-item > .el-form-item__content > div > .el-select > .el-input > .el-input__inner').click();
        await page.getByText('Fire Safety').click();
        await page.locator('div:nth-child(9) > .el-form-item > .el-form-item__content > div > .el-select > .el-input > .el-input__inner').click();
        await page.getByText('Corrective').click();
        await page.locator('div:nth-child(10) > .el-form-item > .el-form-item__content > div > .el-select > .el-input > .el-input__inner').click();
        await page.getByRole('listitem').filter({ hasText: 'Low' }).click();
        await page.locator('.form-one-column > .el-form-item > .el-form-item__content > div > .el-select > .el-input > .el-input__prefix > .float-right > .prefix-icon-container > .lookup-icon').first().click();
        await page.getByRole('row', { name: 'Test 13-12-2022' }).getByRole('cell').filter({ hasText: '1837335' }).click();
        await page.locator('div.fc-border-input-div2').click();
        await page.getByText('Unassigned').nth(1).click();
        await page.getByText('Mukundhan').click();
        await page.getByRole('button', { name: 'Save' }).click();
        const selector = "p.el-message__content";
        const text = "Work Order created successfully";
        await page.waitForSelector(selector);

        // Get the text content of the element
        const message = await page.$eval(selector, (el) => el.textContent.trim());

        // Check that the message matches the expected value
        expect(message).toBe(text);
    } catch (error) {
        console.log(error);
        let message = `${testName} - workorder - cannot create workorder`;
        console.log(message);
        await sendAlertMessage(message);
        message = JSON.stringify(message);
        await toPlaywrightReport(message);
        return -1;
    }
    const workorderPostApi = `${baseURL}/newapp/api/v3/modules/workorder`;
    try {
        const response = await page.waitForResponse(res => res.url().startsWith(workorderPostApi));
        const responseStatus = response.status();
        if (responseStatus < 200 || responseStatus > 299) {
            let message = `${testName} - `
            await toPlaywrightReport(message);
            console.log(`Response status code not successfull: ${responseStatus}`);
        }
        else {
            let message = `${testName} - workorder - workorder created successfully`
            console.log(message);
            await toPlaywrightReport(message);
        }
    } catch (error) {
        console.log(error);
        let message = `${testName} - workorder - cannot find API: ${workorderPostApi}`;
        console.log(message);
        await sendAlertMessage(message);
        message = JSON.stringify(message);
        await toPlaywrightReport(message);
        return -1;
    }
    await page.waitForLoadState('networkidle');
}