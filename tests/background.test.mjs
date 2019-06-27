import * as chrome from "./helpers/chrome.mock.mjs";

import { test } from "../node_modules/zora/dist/bundle/index.mjs";
import { onInstalledCb, onMessageCb } from "../src/background/background.mjs";
import * as utils from "./helpers/utils.mjs";
import { nonPassedRequest, passedRequest } from "./fixtures/requests.mjs";

test("onInstalledCb should add regexps to storage after install", t => {
  chrome.reset();
  onInstalledCb();
  const storage = chrome.fakeStorage.get();
  t.equal({ regexps: ["/jsapi3/", "/api/edge/"] }, storage);
});

test("onMessageCb should call tabs.sendMessage if url matched", async t => {
  const fake = utils.fakeFn();
  chrome.reset().tabs.sendMessage = fake;

  await onMessageCb({ tabId: "1", payload: nonPassedRequest });
  await onMessageCb({ tabId: "2", payload: passedRequest });

  t.equal(fake.called, true, "ok");
  t.equal(fake.callCount, 1, "one times");
  t.equal(fake.args[0][0], "2", "with correct tabId");
  t.equal(
    fake.args[0][1].pathname,
    "/jsapi3/0.1/metro/4/",
    "with correct pathname"
  );
  t.equal(
    fake.args[0][1].deserialized,
    {
      data: [
        {
          id: "1",
          type: "town",
          name: "Moscow",
          region: {
            id: "2",
            type: "region",
            name: "Moscow region",
            country: {
              id: "3",
              type: "country",
              name: "Russia"
            }
          }
        }
      ]
    },
    "with correct deserialized"
  );
  t.equal(
    fake.args[0][1].queryInfo,
    { include: ["lines.stations", "stations", "districts.stations"] },
    "with correct queryInfo"
  );

  t.equal(fake.args[0][1].timeMs, 19, "with correct timeMs");
});
