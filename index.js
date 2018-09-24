const youTubeDl = require("ytdl-core");
const http = require("http");

const server = http.createServer(handleServer);
const PORT = process.env.PORT || 3000;

const youTubeUrl = 'https://youtube.com/watch?v=';

const handleServer = (req, res) => {
    if (req.url.match(/\/[A-Z-a-z-0-9-_]{11}/gi)) {
        const youTubeUrlOfVideo = youTubeUrl + req.url.split('/')[0];
        youTubeDl.getInfo(youTubeUrlOfVideo, (err, info) => {
            if (err) {
                return res.end(JSON.stringify(err))
            }
            return res.end(JSON.stringify(info));
        })
    }
    return res.end(JSON.stringify({
        Error: "404 not found"
    }))
}

server.listen(PORT)