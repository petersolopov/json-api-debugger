const integrationTest = require("puppeteer");
const path = require("path");
const { test } = require("zora");
const { execSync } = require("child_process");

const server = require("./server");

const pathToExtension = path.join(__dirname, "../../tmp");
const puppeteerOptions = {
  executablePath: process.env.CHROME_BIN || null,
  headless: false,
  devtools: true,
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`
  ]
};

test("json api debugger chrome extension", async t => {
  // like before hook
  execSync("rm -rf tmp");
  execSync("unzip json_api_debugger.zip -d tmp");

  const [browser] = await Promise.all([
    integrationTest.launch(puppeteerOptions),
    new Promise(resolve => server.listen(3000, resolve))
  ]);

  await t.test(
    "should log correct messages",
    require("./console.test")(browser)
  );
  await t.test(
    "should open options page and apply changes",
    require("./options.test")(browser)
  );

  // like after hook
  t.ok(
    await Promise.all([
      browser.close(),
      server.close(),
      new Promise(resolve => {
        execSync("rm -rf tmp");
        resolve();
      })
    ])
  );
});
