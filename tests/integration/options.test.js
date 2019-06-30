module.exports = browser => {
  return async t => {
    const getExtensionID = require("./helpers/getExtensionID")(browser);
    const extensionID = await getExtensionID();
    const page = await browser.newPage();
    await page.goto(
      `chrome-extension://${extensionID}/src/options/options.html`
    );
    const twoInputs = await page.$$("input");
    t.eq(twoInputs.length, 2, "with two inputs by default");

    await page.click("button");
    const threeInputs = await page.$$("input");
    t.eq(threeInputs.length, 3, "with three inputs if button was clicked");

    await page.focus('input[name="regexp.2"]');
    await page.keyboard.type("/newendpoint/");
    await page.reload();
    const value = await page.$eval('input[name="regexp.2"]', i => i.value);

    t.eq(value, "/newendpoint/", "with permanent input value after reload");

    await page.goto(`http://localhost:3000/`);
    await page.waitFor(1000); // waiting for extension files loading

    await page.evaluate(async () => {
      await fetch(
        "http://localhost:3000/newendpoint/entity?include=foo,bar,baz&filters[foo]=1"
      );
    });

    const waitForConsole = require("./helpers/waitForConsole")(page);
    const logs = await waitForConsole(5);

    t.eq(logs.length, 5, "log new request");
    await page.close();
  };
};
