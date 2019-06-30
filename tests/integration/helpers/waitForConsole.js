module.exports = page => {
  /**
   * This resolves when the page calls n times
   * console methods or reject after rejectMS ms
   *
   * @param {number} n
   * @param {number} [rejectMS=2000]
   * @return {Promise<void>}
   */
  return function waitForConsole(n, rejectMS = 2000) {
    return new Promise((resolve, reject) => {
      const logs = [];

      page.on("console", msg => {
        logs.push(msg);
        if (logs.length === n) {
          resolve(logs);
        }
      });

      setTimeout(reject, rejectMS);
    });
  };
};
