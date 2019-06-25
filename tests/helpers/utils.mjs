export function fakeFn() {
  const fn = (...args) => {
    fn.called = true;
    fn.callCount += 1;
    fn.args.push(args);
  };

  fn.callCount = 0;
  fn.args = [];
  fn.called = false;

  return fn;
}

export function copy(o) {
  const output = Array.isArray(o) ? [] : {};
  for (const key in o) {
    const v = o[key];
    output[key] = typeof v === "object" ? copy(v) : v;
  }
  return output;
}

export function createFakeRequestObject({
  mimeType = "application/json",
  body = "body"
}) {
  return {
    response: {
      content: {
        mimeType
      }
    },
    request: {},
    getContent: cb => {
      cb(body);
    }
  };
}
