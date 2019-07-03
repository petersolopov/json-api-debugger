module.exports = browser => {
  return async t => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:3000/`);
    await page.waitFor(1000); // waiting for extension files loading

    await page.evaluate(async () => {
      await fetch(
        "http://localhost:3000/jsapi3/entity?include=foo,bar,baz&filters[foo]=1"
      );
    });

    const logs = await require("./helpers/waitForConsole")(page)(5);

    const values = await Promise.all(
      logs.map(msg => {
        const [, payload] = msg.args();
        return payload ? payload.jsonValue() : msg.text();
      })
    );

    const [groupTextStart, data, queryInfo, timeMs, groupTextEnd] = values;

    t.eq(groupTextStart, "GET /jsapi3/entity", "group start");
    t.eq(
      data,
      {
        data: [
          {
            id: "1",
            type: "town",
            name: "Moscow"
          }
        ]
      },
      "deserialized data"
    );
    t.eq(
      queryInfo,
      {
        include: ["foo", "bar", "baz"],
        "filters[foo]": "1"
      },
      "query info "
    );
    t.ok(timeMs, "time ms");
    t.eq(groupTextEnd, "GET /jsapi3/entity", "group end");

    await page.evaluate(async () => {
      await fetch(
        "http://localhost:3000/unknowendpoint/entity?include=foo,bar,baz&filters[foo]=1"
      );
    });

    let wasError = false;
    try {
      await require("./helpers/waitForConsole")(page)(1);
    } catch (e) {
      wasError = true;
    }

    t.ok(wasError, "do not log if request url was not matched");
    await page.close();
  };
};
