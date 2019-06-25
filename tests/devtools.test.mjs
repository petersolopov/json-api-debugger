import * as chrome from "./helpers/chrome.mock.mjs";

import { test } from "../node_modules/zora/dist/bundle/index.mjs";
import { onRequestFinishedCb } from "../src/devtools/devtools.mjs";
import * as utils from "./helpers/utils.mjs";

test("onRequestFinishedCb", t => {
  t.test("should not call sendMessage without response content", t => {
    const fake = utils.fakeFn();
    chrome.reset().runtime.sendMessage = fake;

    const fakeRequest = utils.createFakeRequestObject({});
    onRequestFinishedCb({
      ...fakeRequest,
      response: {
        ...fakeRequest.response,
        content: undefined
      }
    });

    t.equal(false, fake.called, "ok");
  });

  t.test("should call sendMessage with valid mimeType", t => {
    const fake = utils.fakeFn();
    chrome.reset().runtime.sendMessage = fake;

    const mimeTypes = [
      "text/html",
      "text/javascript",
      "image/jpeg",
      "audio/mpeg",
      "multipart/form-data",
      "application/octet-stream",
      "application/javascript",
      "application/vnd.api+json", // valid
      "application/json" // valid
    ];

    mimeTypes.forEach(mimeType => {
      onRequestFinishedCb(utils.createFakeRequestObject({ mimeType }));
    });

    t.equal(fake.called, true, "ok");
    t.equal(fake.callCount, 2, "two times");
    t.equal(fake.args[0][0].tabId, chrome.globalTabId, "with correct tabId #1");
    t.equal(fake.args[0][0].payload.body, "body", "with correct body #1");
    t.equal(
      fake.args[0][0].payload.response.content.mimeType,
      "application/vnd.api+json",
      "with correct mimeType #1"
    );

    t.equal(fake.args[1][0].tabId, chrome.globalTabId, "with correct tabId #2");
    t.equal(fake.args[1][0].payload.body, "body", "with correct body #2");
    t.equal(
      fake.args[1][0].payload.response.content.mimeType,
      "application/json",
      "with correct mimeType #2"
    );
  });
});
