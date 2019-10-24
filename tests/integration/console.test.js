module.exports = browser => {
  return async t => {
    const page = await browser.newPage();
    const waitForConsole = await require("./helpers/waitForConsole")(page);
    await page.goto(`http://localhost:3000/`);
    await page.waitFor(1000); // waiting for extension files loading

    await page.evaluate(async () => {
      await fetch(
        "http://localhost:3000/jsapi3/entity?include=foo,bar,baz&filters[foo]=1"
      );
    });

    const logs = await waitForConsole(5);

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
      "response"
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
      await fetch("http://localhost:3000/jsapi3/town/1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            id: "2",
            type: "town",
            attributes: {
              name: "Moscow"
            }
          }
        })
      });
    });

    const postLogs = await waitForConsole(5);

    const postValues = await Promise.all(
      postLogs.map(msg => {
        const [, payload] = msg.args();
        return payload ? payload.jsonValue() : msg.text();
      })
    );

    t.eq(postValues[0], "POST /jsapi3/town/1", "group start");
    t.eq(
      postValues[1],
      {
        data: {
          id: "2",
          type: "town",
          name: "Moscow"
        }
      },
      "request"
    );
    t.eq(
      postValues[2],
      {
        data: [
          {
            id: "1",
            type: "town",
            name: "Moscow"
          }
        ]
      },
      "response"
    );

    t.eq(postValues[0], "POST /jsapi3/town/1", "group end");

    await page.evaluate(async () => {
      await fetch(
        "http://localhost:3000/unknowendpoint/entity?include=foo,bar,baz&filters[foo]=1"
      );
    });

    let wasError = false;
    try {
      await waitForConsole(1);
    } catch (e) {
      wasError = true;
    }

    t.ok(wasError, "do not log if request url was not matched");
    await page.close();
  };
};
