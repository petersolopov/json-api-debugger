import { deserialise } from "../../node_modules/kitsu-core/lib/index.mjs";
import { createQueryInfo } from "../utils/createQueryInfo.mjs";
import storageSync from "../utils/storageSync.mjs";

export const onInstalledCb = () => {
  const regexps = ["/jsapi3/", "/api/edge/"];
  chrome.storage.sync.set({ regexps });
};

export const onMessageCb = async ({ tabId, payload }) => {
  const { regexps } = await storageSync.get("regexps");
  const { request, body, time: timeMs } = payload;
  const { url, method } = request;

  const shouldLog = regexps.some(regexp => new RegExp(regexp).test(url));

  if (!shouldLog) {
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
