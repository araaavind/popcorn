const socket = io('https://popcornapp-server.herokuapp.com/');
let online = true;

socket.on('connect', () => {
    if (!online) {
        let alertOnline = new Alert("#2cff84");
        alertOnline.display("You're back online!", 5000);
        online = true;
    }
});

socket.on('connect_error', (err) => {
    if (online) {
        let alertOffline = new Alert("#ff2c4f");
        alertOffline.display("You are offline. Some functionality may be unavailable.", 10000);
        online = false;
    }
});

const { remote } = require('electron');
const srt2vtt = require('srt-to-vtt');
const fs = require('fs');

const videoInputButton = document.getElementById('videoInputButton');
const subsInputButton = document.getElementById('subsInputButton');
const URL = window.URL || window.webkitURL;
let vttTempFilePath;

if (remote.process.argv.length >= 2) {
    let filePath = remote.process.argv[1];
    if (filePath !== '.') {
        player.src({ type: "video/webm", src: filePath });
        document.getElementById('homeScreen').style.display = 'none';
    }
}

function openUI() {
    document.getElementById('homeScreen').style.display = 'block';
    if (player.src === null) {
        document.getElementById('closeUi').style.visibility = "hidden";
    } else {
        document.getElementById('closeUi').style.visibility = "visible";
    }
}

function playSelectedFile(event) {
    if (vttTempFilePath) {
        fs.unlinkSync(vttTempFilePath);
        vttTempFilePath = undefined;
    }

    let file = this.files[0];
    if (!file) {
        return;
    }
    let type = file.type;
    if (type === "video/x-matroska" || type === "video/avi") {
        type = "video/webm";
    }
    let videoNode = document.querySelector('video');
    let canPlay = videoNode.canPlayType(type);
    if (canPlay === '') {
        canPlay = 'no';
    }
    let isError = canPlay === 'no';
    if (isError) {
        console.log("cant play " + type + " format.");
        return;
    }

    let fileURL = URL.createObjectURL(file);
    player.src({ type: type, src: fileURL });
    loadedFilePath = undefined;
    document.getElementById('homeScreen').style.display = "none";
    // document.getElementsByClassName('vjs-title-bar')[0].textContent = file.name; // for video-js titlebar
    document.getElementById('videoName').textContent = (file.name.length <= 30) ? file.name : file.name.slice(0, 30) + "...";
    document.getElementById('videoName').style.borderLeft = "1px solid #fff";
}

function loadSubtitles(event) {
    let file = this.files[0];
    if (!file) {
        return;
    }
    let type = file.name.slice(-3);

    if (type === 'srt') {
        let w;
        vttTempFilePath = file.path.replace('.srt', '.vtt');

        fs.createReadStream(file.path)
            .pipe(srt2vtt())
            .pipe(w = fs.createWriteStream(vttTempFilePath));

        w.on('finish', () => {
            let vttContent = fs.readFileSync(vttTempFilePath);
            let vttFile = new File([vttContent], 'vttFile.vtt');
            let fileURL = URL.createObjectURL(vttFile);
            player.addRemoteTextTrack({
                kind: 'captions',
                label: file.name.slice(0, -4),
                src: fileURL
            }, false);
        });
    } else {
        let fileURL = URL.createObjectURL(file);
        player.addRemoteTextTrack({
            kind: 'captions',
            label: file.name.slice(0, -4),
            src: fileURL
        }, false);
    }
}

videoInputButton.addEventListener('change', playSelectedFile);
subsInputButton.addEventListener('change', loadSubtitles);