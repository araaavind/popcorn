socket.on('connected', (msg) => {
    console.log(msg.body);
});

const chatOpenButton = document.getElementById('chatOpenButton');
const chatArea = document.getElementById('chatArea');
chatOpenButton.addEventListener("click", (e) => {
    let icon = chatOpenButton.querySelector('i');
    icon.classList.toggle("fa-comment-slash");
    icon.classList.toggle("fa-comments");
    chatOpenButton.classList.toggle("player-button-active");
    if(chatArea.style.visibility === "hidden") {
        chatArea.style.visibility = "visible";
    }
    else {
        chatArea.style.visibility = "hidden";
    }
});