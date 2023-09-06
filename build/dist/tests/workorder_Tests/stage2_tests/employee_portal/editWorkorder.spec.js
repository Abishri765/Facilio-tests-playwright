import { toPlaywrightReport } from "../../../utils/Annotations";
import { sendAlertMessage } from "../../../utils/bot";

export async function editWorkorder_mainApp(page, baseURL, testName) {
  const { expect } = require("@playwright/test");
  page.setDefaultTimeout(30000);
    try {
        await page.locator('div').filter({ hasText: 'EditDelete' }).click();
  await page.getByText('Edit').click();
  await page.locator(".el-input__inner").first().click();
  await page.locator(".el-input__inner").first().fill("test 123");
      await page.getByRole("button", { name: "Save" }).click();

      const selector = "p.el-message__content";
      const text = "Work Order updated successfully";
      await page.waitForSelector(selector);

      // Get the text content of the element
      const message = await page.$eval(selector, (el) => el.textContent.trim());

      // Check that the message matches the expected value
      expect(message).toBe(text);
    } catch (error) {
      console.log(error);
      let message = `${testName} - workorder - cannot edit workorder`;
      console.log(message);
      await sendAlertMessage(message);
      message = JSON.stringify(message);
      await toPlaywrightReport(message);
      return -1;
    }

  const workorderPostApi = `${baseURL}/tenant/api/v3/modules/workorder`;
  try {
    const response = await page.waitForResponse((res) =>
      res.url().startsWith(workorderPostApi)
    );
    const responseStatus = response.status();
    if (responseStatus < 200 || responseStatus > 299) {
      let message = `${testName} - `;
      await toPlaywrightReport(message);
      console.log(`Response status code not successfull: ${responseStatus}`);
    } else {
      let message = `${testName} - workorder - workorder edited successfully`;
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
  await page.waitForLoadState("networkidle");
}
