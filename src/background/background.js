import { deserialise } from "../../node_modules/kitsu-core/lib/index.mjs";
import { createQueryInfo } from "../utils/createQueryInfo.mjs";
import storageSync from "../utils/storageSync.mjs";

chrome.runtime.onInstalled.addListener(function() {
  const regexps = ["/jsapi3/", "/api/edge/"];
  chrome.storage.sync.set({ regexps });
});

chrome.runtime.onMessage.addListener(async ({ tabId, payload }) => {
  const { regexps } = await storageSync.get("regexps");
  const { request, body, time: timeMs } = payload;

  const shouldLog = regexps.some(regexp =>
    new RegExp(regexp).test(request.url)
  );

  if (!shouldLog) {
    return;
  }

  try {
    const parsedBody = JSON.parse(body);
    const deserialized = await deserialise(parsedBody);
    const { pathname } = new URL(request.url);
    const queryInfo = createQueryInfo(request.url);

    chrome.tabs.sendMessage(tabId, {
      pathname,

      deserialized,
      queryInfo,
      timeMs
    });
  } catch (e) {
    console.log(e);
  }
});
