const youTubeDl = require("ytdl-core");
const { createServer } = require("http");
const { get } = require("https");
const { readFileSync } = require("fs");

const PORT = process.env.PORT || 3000;
const youTubeUrl = "https://youtube.com/watch?v=";

const handleServer = (req, res) => {
  console.log("Request received");
  if (req.url === "/") {
    res.end(readFileSync("index.html"));
  } else if (req.url.match(/\/[A-Z-a-z-0-9-_]{11}\/[0-9]{2,3}/gi)) {
    console.log("Getting youtube stuff");
    const youtubeVideoId = req.url.split("/")[1];
    const downloadId = req.url.split("/")[2];
    const youTubeUrlOfVideo = youTubeUrl + youtubeVideoId;
    youTubeDl
      .getInfo(youTubeUrlOfVideo)
      .then(data => {
        console.log(
          `Successfully completed request to YouTube: ${youtubeVideoId}`
        );
        const requestedFormat = data.formats.find(f => f.itag === downloadId);

        req.pipe(
          get(requestedFormat.url, resp => {
            resp.headers["Content-Type"] = "application/octet-stream";
            resp.headers["Content-Disposition"] = `inline; filename="${
              data.title
            }.${requestedFormat.container}"`;
            res.writeHead(resp.statusCode, resp.headers);
            resp.pipe(
              res,
              { end: true }
            );
          }),
          {
            end: true
          }
        );
        console.log(requestedFormat);
      })
      .catch(error => {
        console.log(
          `Error occurred: ${error.message || error} <:${youtubeVideoId}`
        );
        res.end(JSON.stringify(error));
      });
  } else {
    console.log("404 occurred");
    res.end(
      JSON.stringify({
        Error: "404 not found"
      })
    );
  }
};

const server = createServer(handleServer);
server.listen(PORT);

console.log(`Listening http://127.0.0.1:${PORT}`);
