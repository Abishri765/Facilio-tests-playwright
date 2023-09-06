import { toPlaywrightReport } from "../../../utils/Annotations";
import { sendAlertMessage } from "../../../utils/bot";

export async function editWorkorder_vendorportal(page, baseURL, testName) {
  const { expect } = require("@playwright/test");
  page.setDefaultTimeout(30000);
  try {
    await page
      .getByRole("tabpanel", { name: "Summary" })
      .getByText("Edit")
      .click();
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
    await sendAlertMessage(message, "workorder");
    message = JSON.stringify(message);
    await toPlaywrightReport(message);
    return -1;
  }
}
