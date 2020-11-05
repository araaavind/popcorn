const socket = io('https://popcornapp-server.herokuapp.com/');

const videoInputButton = document.getElementById('videoInputButton');
const URL = window.URL || window.webkitURL;

function playSelectedFile(event) {
    let file = this.files[0];
    let type = file.type;
    let videoNode = document.querySelector('video');
    let canPlay = videoNode.canPlayType(type);
    if (canPlay === '') {
        canPlay = 'no';
    }
    let isError = canPlay === 'no';
    if (isError) {
        console.log("cant play this format");
        return;
    }

    let fileURL = URL.createObjectURL(file);
    player.src({ type: type, src: fileURL });
    document.getElementById('homeScreen').style.display = "none";
}

videoInputButton.addEventListener('change', playSelectedFile);