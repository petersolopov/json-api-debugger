import { copy } from "./utils.mjs";

const TAB_ID = "tabId";

const createFakeStorage = () => {
  let store = {};

  const set = data => (store = { ...store, ...data });
  const get = () => store;
  const reset = () => (store = copy({}));

  return { set, get, reset };
};

export const fakeStorage = createFakeStorage();

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
    sendMessage: () => {},
    onInstalled: {
      addListener: () => {}
    },
    onMessage: {
      addListener: () => {}
    }
  },
  storage: {
    sync: {
      set: (data, fn) => {
        fakeStorage.set(data);
        fn && fn(data);
      },
      get: (key, fn) => {
        fn && fn(fakeStorage.get());
      }
    }
  },
  tabs: {
    sendMessage: () => {}
  }
};

global.chrome = copy(chromeMock);

export const reset = () => {
  global.chrome = copy(chromeMock);
  fakeStorage.reset();
  return global.chrome;
};
export const getChrome = () => global.chrome;
export const globalTabId = TAB_ID;

export default global.chrome;
