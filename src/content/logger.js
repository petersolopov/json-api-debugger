chrome.runtime.onMessage.addListener(({ groupName, ...restData }) => {
  console.groupCollapsed(groupName);
  Object.entries(restData).forEach(([key, value]) => {
    console.log(`${key}: `, value);
  });
  console.groupEnd(groupName);
});
