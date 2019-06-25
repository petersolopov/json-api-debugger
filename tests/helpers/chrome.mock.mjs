import { copy } from "./utils.mjs";

const TAB_ID = "tabId";

const chromeMock = {
  devtools: {
    inspectedWindow: {
      tabId: TAB_ID
    },
    network: {
      onRequestFinished: {
        addListener: () => {}
      }
    }
  },
  runtime: {
    sendMessage: () => {}
  }
};

global.chrome = copy(chromeMock);

export const reset = () => (global.chrome = copy(chromeMock));
export const getChrome = () => global.chrome;
export const globalTabId = TAB_ID;

export default global.chrome;
