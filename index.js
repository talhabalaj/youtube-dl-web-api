const youTubeDl = require("ytdl-core");
const http = require("http");

let handleServer;
const PORT = process.env.PORT || 3000;

const youTubeUrl = 'https://youtube.com/watch?v=';

handleServer = (req, res) => {
    console.log("Request received");
    if (req.url.match(/\/[A-Z-a-z-0-9-_]{11}/gi)) {
        console.log("Getting youtube stuff");
        const youtubeVideoId = req.url.split('/')[1];
        const youTubeUrlOfVideo = youTubeUrl + youtubeVideoId;
        youTubeDl.getInfo(youTubeUrlOfVideo)
          .then(data => {
            console.log("Successfully completed request to YouTube: " + youtubeVideoId)
            res.end(JSON.stringify(data));
          })
          .catch(error => {
            console.log("Error occurred while getting youtube url " + youtubeVideoId)
            res.end(JSON.stringify(error));
          });
    } else {
        console.log("404 occurred");
        res.end(JSON.stringify({
            Error: "404 not found"
        }))
    }
}

const server = http.createServer(handleServer);
server.listen(PORT)

console.log("Listening http://localhost:" + PORT)