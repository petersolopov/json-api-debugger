export const nonPassedRequest = {
  request: {
    method: "GET",
    url: "https://site.ru/api/0.1/metro/4/"
  }
};

export const passedGetRequest = {
  time: 19,
  request: {
    method: "GET",
    url: "https://site.ru/jsapi3/0.1/town/1/?include=town.region.country"
  },
  response: {
    content: {
      mimeType: "application/json"
    }
  },
  body: JSON.stringify({
    data: {
      id: "1",
      type: "town",
      attributes: {
        name: "Moscow"
      },
      relationships: {
        region: {
          data: {
            id: "2",
            type: "region"
          }
        }
      }
    },
    included: [
      {
        id: "2",
        type: "region",
        attributes: {
          name: "Moscow region"
        },
        relationships: {
          country: {
            data: {
              id: "3",
              type: "country"
            }
          }
        }
      },
      {
        id: "3",
        type: "country",
        attributes: {
          name: "Russia"
        }
      }
    ]
  })
};

export const passedPostRequest = {
  time: 19,
  request: {
    bodySize: 123,
    method: "POST",
    url: "https://site.ru/jsapi3/0.1/town/1/",
    postData: {
      mimeType: "application/json; charset=UTF-8",
      text: JSON.stringify({
        data: {
          id: "1",
          type: "town",
          attributes: {
            name: "Moscow"
          }
        }
      })
    }
  },
  response: {
    content: {
      mimeType: "application/json"
    }
  },
  body: JSON.stringify({
    data: {
      id: "1",
      type: "town",
      attributes: {
        name: "Moscow"
      }
    }
  })
};
