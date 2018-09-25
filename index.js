const youTubeDl = require("ytdl-core");
const http = require("http");
const https = require("https");
const URL = require("url");

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
        if (req.headers.range) {
          const total = requestedFormat.clen;
          const { range } = req.headers;
          const parts = range.replace(/bytes=/, "").split("-");
          const [partialstart, partialend] = parts;

          const start = parseInt(partialstart, 10);
          const end = partialend ? parseInt(partialend, 10) : total - 1;
          const chunksize = end - start + 1;
          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${total}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize
          });
          const url = URL.parse(requestedFormat.url);
          req.pipe(
            https.request(
              {
                ...url,
                headers: {
                  "Content-Range": `bytes ${start}-${end}/${total}`
                }
              },
              resp => {
                resp.pipe(
                  res,
                  { end: true }
                );
              }
            ),
            { end: true }
          );
        } else {
          req.pipe(
            https.get(requestedFormat.url, resp => {
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
        }
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
