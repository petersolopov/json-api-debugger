import * as chrome from "./helpers/chrome.mock.mjs";

import { test } from "../../node_modules/zora/dist/bundle/index.mjs";
import {
  onInstalledCb,
  onMessageCb,
  DEFAULT_STORAGE_DATA
} from "../../src/background/background.mjs";
import * as utils from "./helpers/utils.mjs";
import {
  nonPassedRequest,
  passedGetRequest,
  passedPostRequest
} from "./fixtures/requests.mjs";

test("background script", async t => {
  await t.test(
    "onInstalledCb should add default options data to storage",
    async t => {
      chrome.reset();
      await onInstalledCb();
      const storage = chrome.fakeStorage.get();
      t.equal({ regexps: ["/jsapi3/", "/api/edge/"], turnedOn: true }, storage);
    }
  );

  await t.test(
    "onMessageCb should call sendMessage if url matched",
    async t => {
      chrome.reset().storage.sync.set(DEFAULT_STORAGE_DATA);
      const fake = utils.fakeFn();
      chrome.getChrome().tabs.sendMessage = fake;

      await onMessageCb({ tabId: "1", payload: nonPassedRequest });
      await onMessageCb({ tabId: "2", payload: passedGetRequest });

      t.equal(fake.called, true, "ok");
      t.equal(fake.callCount, 1, "one time");
      t.equal(fake.args[0][0], "2", "with correct tabId");
      t.equal(
        fake.args[0][1].groupName,
        "GET /jsapi3/0.1/town/1/",
        "with correct groupName"
      );
      t.equal(
        fake.args[0][1].response,
        {
          data: {
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
        },
        "with correct response"
      );
      t.equal(
        fake.args[0][1].hasOwnProperty("request"),
        false,
        "do not have request"
      );
      t.equal(
        fake.args[0][1].queryInfo,
        { include: ["town.region.country"] },
        "with correct queryInfo"
      );

      t.equal(fake.args[0][1].timeMs, 19, "with correct timeMs");
    }
  );

  await t.test(
    "onMessageCb should call sendMessage with correct post data",
    async t => {
      chrome.reset().storage.sync.set(DEFAULT_STORAGE_DATA);
      const fake = utils.fakeFn();
      chrome.getChrome().tabs.sendMessage = fake;
      await onMessageCb({ tabId: "2", payload: passedPostRequest });

      t.equal(fake.called, true, "ok");
      t.equal(fake.callCount, 1, "one time");

      t.equal(
        fake.args[0][1].groupName,
        "POST /jsapi3/0.1/town/1/",
        "with correct groupName"
      );

      t.equal(
        fake.args[0][1].response,
        {
          data: {
            id: "1",
            type: "town",
            name: "Moscow"
          }
        },
        "with correct response"
      );

      t.equal(
        fake.args[0][1].request,
        {
          data: {
            id: "1",
            type: "town",
            name: "Moscow"
          }
        },
        "with correct request"
      );
    }
  );

  await t.test(
    "onMessageCb should not call sendMessage if turnedOn option is false",
    async t => {
      chrome.reset().storage.sync.set(DEFAULT_STORAGE_DATA);
      const fake = utils.fakeFn();
      chrome.getChrome().tabs.sendMessage = fake;
      chrome.getChrome().storage.sync.set({ turnedOn: false });
      await onMessageCb({ tabId: "2", payload: passedGetRequest });

      t.equal(fake.called, false, "not be called");
      t.equal(fake.callCount, 0, "zero time");
    }
  );
});
