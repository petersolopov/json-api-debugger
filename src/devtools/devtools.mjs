export const onRequestFinishedCb = request => {
  const { content } = request.response;

  if (!content) {
    return;
  }

  if (!/application\/.*json/.test(content.mimeType)) {
    return;
  }

  // getContext do not work in another context (e.g. in background script)
  request.getContent(body => {
    chrome.runtime.sendMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      payload: {
        ...request,
        body
      }
    });
  });
};

chrome.devtools.network.onRequestFinished.addListener(onRequestFinishedCb);
