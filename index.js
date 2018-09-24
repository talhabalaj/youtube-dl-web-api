const youtubeDl = require("ytdl-core");
const http = require("http");

const server = http.createServer(handleServer);
const PORT = process.env.PORT || 3000;

const youtubeUrl = 'https://youtube.com/watch?v=';

const handleServer = (req, res) => {
    if (req.url.match(/\/[A-Z-a-z-0-9-_]{11}/gi)) {
        const youtubeUrlOfVideo = youtubeUrl + req.url.split('/')[0];
        youtubeDl.getInfo(youtubeUrlOfVideo, (err, info) => {
            if (err) {
                return res.end(JSON.stringify(err))
            }
            return res.end(JSON.stringify(info));
        })
    }
}

server.listen(PORT)