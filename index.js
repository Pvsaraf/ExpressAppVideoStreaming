const express = require("express");

const app = express();
const fs = require("fs");

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
    console.log(__dirname);
})

app.get('/play', (req, res) => {
    const range = req.headers.range;
    // console.log(range);

    const videoPath = "./Sample.mp4";

    const videoSize = fs.statSync(videoPath).size;
    
    // console.log(videoSize);

    const chunkSize = 1*1e6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + chunkSize, videoSize-1);

    const contentLength = end-start + 1;
    
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes", 
        "Content-Length":contentLength,
        "Content-Type":"video/mp4"
    }

    res.writeHead(206, headers);

    const stream = fs.createReadStream(videoPath, {start, end});

    stream.pipe(res);
})


app.get("/download", (req, res) => {
    res.download(__dirname + "/DownloadedVideo.mp4", (err) => {
        if(err)
            console.log(err);
    })
})  


app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
})