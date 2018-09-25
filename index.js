const youTubeDl = require("ytdl-core");
const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;
const youTubeUrl = "https://youtube.com/watch?v=";

const handleServer = (req, res) => {
  console.log("Request received");
  if (req.url.match(/\/[A-Z-a-z-0-9-_]{11}\/[0-9]{2,3}/gi)) {
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
          https.get(requestedFormat.url, resp => {
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

const server = http.createServer(handleServer);
server.listen(PORT);

console.log(`Listening http://127.0.0.1:${PORT}`);
