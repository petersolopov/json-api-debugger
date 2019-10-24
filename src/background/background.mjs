import { deserialise } from "../../node_modules/kitsu-core/lib/index.mjs";
import { createQueryInfo } from "../utils/createQueryInfo.mjs";
import storageSync from "../utils/storageSync.mjs";
import isJsonMimeType from "../utils/isJsonMimeType.mjs";

export const DEFAULT_STORAGE_DATA = {
  regexps: ["/jsapi3/", "/api/edge/"],
  turnedOn: true
};

function getResponse(body) {
  const parsedBody = JSON.parse(body);
  return deserialise(parsedBody);
}

function getRequestBody(request) {
  const { postData, bodySize } = request;

  if (!bodySize || !isJsonMimeType(postData.mimeType)) {
    return null;
  }

  const parsedBody = JSON.parse(postData.text);
  return deserialise(parsedBody);
}

export const onInstalledCb = async () => {
  await chrome.storage.sync.set(DEFAULT_STORAGE_DATA);
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
    const response = await getResponse(body);
    const requestBody = await getRequestBody(request);
    const { pathname } = new URL(url);
    const queryInfo = createQueryInfo(url);
    const groupName = `${method} ${pathname}`;

    chrome.tabs.sendMessage(tabId, {
      groupName,
      ...(requestBody ? { request: requestBody } : null),
      response,
      queryInfo,
      timeMs
    });
  } catch (e) {
    console.log(e);
  }
};

chrome.runtime.onMessage.addListener(onMessageCb);
chrome.runtime.onInstalled.addListener(onInstalledCb);
