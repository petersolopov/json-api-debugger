export const nonPassedRequest = {
  request: {
    method: "GET",
    url: "https://site.ru/api/0.1/metro/4/"
  }
};

export const passedRequest = {
  startedDateTime: "2019-06-26T19:21:42.184Z",
  time: 19,
  request: {
    method: "GET",
    url:
      "https://site.ru/jsapi3/0.1/metro/4/?include=lines.stations%2Cstations%2Cdistricts.stations"
  },
  response: {
    status: 200,
    statusText: "OK",
    content: {
      size: 54813,
      mimeType: "application/json",
      compression: 48614
    }
  },
  body: JSON.stringify({
    data: [
      {
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
      }
    ],
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
