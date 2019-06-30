const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  const data = {
    data: [
      {
        id: "1",
        type: "town",
        attributes: {
          name: "Moscow"
        }
      }
    ]
  };
  res.end(JSON.stringify(data));
});

module.exports = server;
