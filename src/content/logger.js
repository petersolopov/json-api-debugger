chrome.runtime.onMessage.addListener(({ pathname, ...restData }) => {
  console.groupCollapsed(pathname);
  Object.entries(restData).forEach(([key, value]) => {
    console.log(`${key}: `, value);
  });
  console.groupEnd(pathname);
});
