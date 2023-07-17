const WebTorrent = require('webtorrent');
const dragDrop = require('drag-drop');
const VideoStream = require('videostream');

const client = new WebTorrent();
let magnetURI;

document.getElementById('magnetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    magnetURI = document.getElementById('magnetInput').value;

    client.add(magnetURI, function (torrent) {
        // Got torrent metadata!
        console.log('Client is downloading:', torrent.infoHash);

        let file = torrent.files.find(function (file) {
            return file.name.endsWith('.mp4')
        });

        file.renderTo('#torrentVideo');

        document.getElementById('videoPlayer').style.display = "none";
        document.getElementById('torrentVideoContainer').style.display = "block";
        document.getElementById('homeScreen').style.display = "none";

        document.getElementById('videoName').textContent = (file.name.length <= 30) ? file.name : file.name.slice(0, 30) + "...";
        document.getElementById('videoName').style.borderLeft = "1px solid #fff";
    });
});


// // When user drops files on the browser, create a new torrent and start seeding it!
// dragDrop('#homeScreen', function (files) {
//     console.log(files);
//     client.seed(files, function (torrent) {
//         console.log('Client is seeding:', torrent.infoHash);
//     });
// });