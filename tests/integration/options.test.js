module.exports = browser => {
  return async t => {
    const getExtensionID = require("./helpers/getExtensionID")(browser);
    const extensionID = await getExtensionID();
    const page = await browser.newPage();
    await page.goto(
      `chrome-extension://${extensionID}/src/options/options.html`
    );
    const oneCheckbox = await page.$$("input[type='checkbox']");
    const checked = await page.$eval("input[type='checkbox']", c => c.checked);
    t.eq(oneCheckbox.length, 1, "with one checkbox by default");
    t.eq(checked, true, "with checked checkbox by default");

    const twoTextInputs = await page.$$("input[type='text']");
    t.eq(twoTextInputs.length, 2, "with two inputs by default");

    await page.click("button");
    const threeTextInputs = await page.$$("input[type='text']");
    t.eq(threeTextInputs.length, 3, "with three inputs if button was clicked");

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

    await page.goto(
      `chrome-extension://${extensionID}/src/options/options.html`
    );
    await page.click("input[type='checkbox'");

    await page.reload();
    const checkedAfterReload = await page.$eval(
      "input[type='checkbox']",
      c => c.checked
    );
    t.eq(
      checkedAfterReload,
      false,
      "with permanent unchecked checkbox after reload"
    );

    await page.goto(`http://localhost:3000/`);
    await page.waitFor(1000); // waiting for extension files loading

    await page.evaluate(async () => {
      await fetch(
        "http://localhost:3000/newendpoint/entity?include=foo,bar,baz&filters[foo]=1"
      );
    });

    let wasError = false;
    try {
      await waitForConsole(1);
    } catch (e) {
      wasError = true;
    }

    t.ok(wasError, "do not log if turned off");

    await page.close();
  };
};
