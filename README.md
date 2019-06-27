# JSON API debugger chrome extension

![](./screenshot.png)

JSON API is a specification for building APIs detailed at [JSONAPI.org.](https://jsonapi.org)

## Motivation

JSON API is quite verbose and it is hard to view big responses with many nested includes e.g. `include=foo.bar.baz`.

## Solution

It would be nice to view in console the deserialized structure of JSON API response. It is a simple object converted from JSON.

<details>
<summary>JSON API response</summary>
<pre>
{
  "data": [
    {
      "id": "1",
      "type": "town",
      "attributes": {
        "name": "Moscow"
      },
      "relationships": {
        "region": {
          "data": {
            "id": "2",
            "type": "region"
          }
        }
      }
    }
  ],
  "included": [
    {
      "id": "2",
      "type": "region",
      "attributes": {
        "name": "Moscow region"
      },
      "relationships": {
        "country": {
          "data": {
            "id": "3",
            "type": "country"
          }
        }
      }
    },
    {
      "id": "3",
      "type": "country",
      "attributes": {
        "name": "Russia"
      }
    }
  ]
}
</pre>
</details>
<details>
<summary>Deserialized structure</summary>
<pre>
{
  data: [
    {
      id: "1",
      type: "town",
      name: "Moscow",
      region: {
        id: "2",
        type: "region",
        name: "Moscow region",
        country: {
          id: "3",
          type: "country",
          name: "Russia"
        },
      }
    }
  ]
};
</pre>
</details>

## Supports

Google Chrome 60+

## Usage

1. Install extension.
2. Add rule (regexp) in options for your JSON API endpoint to catch it.
3. View data in console (deserialized response, query info, etc.).

## Build

1. Install dependencies `npm install`
2. Zip chrome extension `npm run build`
