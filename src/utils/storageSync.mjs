// helpers to avoid callback hell

const get = arg => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(arg, data => {
      resolve(data);
    });
  });
};

const set = arg => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(arg, data => {
      resolve(data);
    });
  });
};

export default {
  get,
  set
};
