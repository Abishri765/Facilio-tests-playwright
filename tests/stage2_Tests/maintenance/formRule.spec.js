import { toPlaywrightReport } from "../../utils/Annotations";
import { sendAlertMessage } from "../../utils/bot";

export async function isFormRuleWorking(page, baseURL, testName) {
    page.setDefaultTimeout(30000);
    try {
        //await page.getByRole('link', { name: 'Maintenance' }).click();
        await page.goto(`${baseURL}/maintenance/maintenance/workorder/open`);
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('//*[@id="q-app"]/div[1]/div[1]/div[2]/div/div[1]/main/div[1]/div/div[3]/div/div[1]');
        await page.getByRole('button', { name: 'New Work Order' }).click();
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.el-select > .el-input > .el-input__inner');
        await page.locator('.el-select > .el-input > .el-input__inner').first().click();
        await page.getByText('Standard').click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        await page.locator('div:nth-child(11) > .el-form-item > .el-form-item__content > .f-lookup-chooser > .el-select > .el-input > .el-input__inner').click();
        await page.getByRole('listitem').filter({ hasText: 'Appliances' }).click();
    } catch (error) {
        console.log(error);
        const message = `${testName} - Form Rule - Error occured in workorder page`
        console.log(message);
        await sendAlertMessage(message);
        await toPlaywrightReport(message);
        return -1;
    }
    const pickListApi = `${baseURL}/maintenance/api/v3/picklist/vendors?clientCriteria=%7B%22conditions%22%3A%7B%221%22%3A%7B%22columnName%22%3A%22Vendors.LOOKUP_CF1%22%2C%22computedValues%22%3Anull%2C%22computedWhereClause%22%3Anull%2C%22conditionId%22%3A2822207%2C%22criteriaValue%22%3Anull%2C%22criteriaValueId%22%3A-1%2C%22expressionValue%22%3Afalse%2C%22fieldName%22%3A%22services_vendors%22%2C%22isExpressionValue%22%3Anull%2C%22jsonValue%22%3Anull%2C%22jsonValueStr%22%3Anull%2C%22moduleName%22%3Anull%2C%22operator%22%3A%22IS%22%2C%22operatorId%22%3A36%2C%22parentCriteriaId%22%3A2582913%2C%22sequence%22%3A1%2C%22value%22%3A%22748784%22%7D%7D%2C%22pattern%22%3A%22%281%29%22%7D&viewName=hidden-all`;
    try {
        const response = await page.waitForResponse(res => res.url().startsWith(pickListApi));
        const responsedata = await response.json();
        const pickListCount = responsedata.data.pickList.length;
        if (pickListCount != 1) {
            const message = `stage2 maintenance - formRule - Error: Expected count of 1 failed`;
            console.log(message);
            await toPlaywrightReport(message);
            return -1;
        }
        await page.locator('div:nth-child(14) > .el-form-item > .el-form-item__content > .f-lookup-chooser > .el-select > .el-input > .el-input__inner').click();
        await page.getByRole('listitem').filter({ hasText: 'vendor_2' }).click();
    } catch (error) {
        console.log(error);
        let message = `${testName} - Form Rule - could not fetch API: ${encodeURIComponent(pickListApi)}`;
        console.log(message);
        await sendAlertMessage(message);
        message = JSON.stringify(message);
        await toPlaywrightReport(message);
        return -1;
    }
    let message = `${testName} - Form Rule - formRule working normally`;
    console.log(message);
    await toPlaywrightReport(message);
};
