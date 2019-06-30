module.exports = browser => {
  /**
   * Trick to get extensionID for building url like chrome-extension://{{extensionID}}/**
   * @return {Promise<string>} extensionID
   */
  return async function getExtensionID() {
    const targets = await browser.targets();
    const backgroundPageTarget = targets.find(target => {
      return (
        target._targetInfo.title === "json api debugger" &&
        target.type() === "background_page"
      );
    });

    const extensionUrl = backgroundPageTarget._targetInfo.url || "";
    const [, , extensionID] = extensionUrl.split("/");

    return extensionID;
  };
};
