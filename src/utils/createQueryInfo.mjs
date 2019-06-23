const toValue = (key, value) => {
  if (key === "include") {
    return value.split(",");
  }

  return value;
};

export const createQueryInfo = url => {
  const urlParsed = new URL(url);
  const acc = {};

  for (var [key, value] of urlParsed.searchParams.entries()) {
    acc[key] = toValue(key, value);
  }

  return acc;
};
