import { deserialise } from "../../node_modules/kitsu-core/lib/index.mjs";
import { createQueryInfo } from "../utils/createQueryInfo.mjs";
import storageSync from "../utils/storageSync.mjs";

export const DEFAULT_STORAGE_DATA = {
  regexps: ["/jsapi3/", "/api/edge/"],
  turnedOn: true
};

export const onInstalledCb = () => {
  chrome.storage.sync.set(DEFAULT_STORAGE_DATA);
};

export const onMessageCb = async ({ tabId, payload }) => {
  const { regexps, turnedOn } = await storageSync.get(["regexps", "turnedOn"]);
  const { request, body, time: timeMs } = payload;
  const { url, method } = request;

  const shouldLog = regexps.some(regexp => new RegExp(regexp).test(url));

  if (!shouldLog || !turnedOn) {
    return;
  }

  try {
    const parsedBody = JSON.parse(body);
    const deserialized = await deserialise(parsedBody);
    const { pathname } = new URL(url);
    const queryInfo = createQueryInfo(url);
    const groupName = `${method} ${pathname}`;

    chrome.tabs.sendMessage(tabId, {
      groupName,

      deserialized,
      queryInfo,
      timeMs
    });
  } catch (e) {
    console.log(e);
  }
};

chrome.runtime.onMessage.addListener(onMessageCb);
chrome.runtime.onInstalled.addListener(onInstalledCb);
