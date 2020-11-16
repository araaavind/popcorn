const WebTorrent = require('webtorrent');
const dragDrop = require('drag-drop');

const client = new WebTorrent();
const magnetURI = 'magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent';

client.add(magnetURI, function (torrent) {
    // Got torrent metadata!
    console.log('Client is downloading:', torrent.infoHash);

    let file = torrent.files.find(function (file) {
        return file.name.endsWith('.mp4')
    });

    file.renderTo('video', { controls: false });
});


// // When user drops files on the browser, create a new torrent and start seeding it!
// dragDrop('#homeScreen', function (files) {
//     console.log(files);
//     client.seed(files, function (torrent) {
//         console.log('Client is seeding:', torrent.infoHash);
//     });
// });