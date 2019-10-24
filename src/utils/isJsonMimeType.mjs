/**
 * It is returns true if it's json mime type.
 * e.g. JSON:API requires use of the JSON:API media type (application/vnd.api+json) for exchanging data.
 * @param {string} mimeType
 * @return {boolean}
 */
function isJsonMimeType(mimeType) {
  return /application\/.*json/.test(mimeType);
}

export default isJsonMimeType;
