const socket = io('https://popcornapp-server.herokuapp.com/');
const { remote } = require('electron');

const videoInputButton = document.getElementById('videoInputButton');
const URL = window.URL || window.webkitURL;

if (remote.process.argv.length >= 2) {
    let filePath = remote.process.argv[1];
    if(filePath !== '.') {
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
    let file = this.files[0];
    let type = file.type;
    if (type === "video/x-matroska") {
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

videoInputButton.addEventListener('change', playSelectedFile);