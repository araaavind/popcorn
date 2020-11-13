const chatOpenButton = document.getElementById('chatOpenButton');
const chatRoom = document.getElementById('chatRoom');
const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');

chatOpenButton.addEventListener("click", (e) => {
    let icon = chatOpenButton.querySelector('i');
    icon.classList.toggle("fa-comment-slash");
    icon.classList.toggle("fa-comments");
    chatOpenButton.classList.toggle("player-button-active");
    if (chatRoom.style.visibility === "hidden") {
        chatRoom.style.visibility = "visible";
    }
    else {
        chatRoom.style.visibility = "hidden";
    }
    messageInput.focus();
    chatArea.scrollTop = chatArea.scrollHeight;
});

function createMessageElement(packet, type) {
    let messageContainer = document.createElement('div');
    let messageAuthorSpan = document.createElement('span');
    let messageContentSpan = document.createElement('span');
    messageAuthorSpan.setAttribute('class', "message-author");
    messageContentSpan.setAttribute('class', "message-content");
    messageContentSpan.textContent = packet.message;

    if (type === "SENT") {
        messageContainer.setAttribute('class', "message-container sent-message");
        messageAuthorSpan.textContent = "You";
    } else if (type === "RECEIVED") {
        messageContainer.setAttribute('class', "message-container");
        messageAuthorSpan.textContent = packet.nickname;
    }

    messageContainer.appendChild(messageAuthorSpan);
    messageContainer.appendChild(messageContentSpan);

    return messageContainer;
}

function createChatInfoElement(message) {
    let infoContainer = document.createElement('span');
    infoContainer.setAttribute('class', "chat-info-container");
    infoContainer.textContent = message;
    return infoContainer;
}

document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if(messageInput.value == "" || messageInput.value == undefined || messageInput.value == " ") {
        return;
    }
    if (!packet.sessionId) {
        console.log("no one in party");
        return;
    }
    packet.message = messageInput.value;
    messageInput.value = "";
    packet.action = "MESSAGE";
    socket.emit('message', packet);

    chatArea.appendChild(createMessageElement(packet, "SENT"));
    chatArea.scrollTop = chatArea.scrollHeight;
});

socket.on('message', (packet) => {
    if (packet.action === "MESSAGE") {
        chatArea.appendChild(createMessageElement(packet, "RECEIVED"));
        chatArea.scrollTop = chatArea.scrollHeight;
    } else if (packet.action === "CREATE") {
        chatArea.appendChild(createChatInfoElement(packet.nickname + " created the party :)"));
        chatArea.scrollTop = chatArea.scrollHeight;
    } else if (packet.action === "RECONNECT") {
        chatArea.appendChild(createChatInfoElement(packet.nickname + " has reconnected."));
        chatArea.scrollTop = chatArea.scrollHeight;
    } else if (packet.action === "SUBSCRIBE") {
        let alert = new Alert();
        alert.display(packet.nickname + " joined the party :D");

        chatArea.appendChild(createChatInfoElement(packet.nickname + " joined the party :D"));
        chatArea.scrollTop = chatArea.scrollHeight;
    } else if (packet.action === "UNSUBSCRIBE") {
        let alert = new Alert();
        alert.display(packet.nickname + " left the party :(");

        chatArea.appendChild(createChatInfoElement(packet.nickname + " left the party :("));
        chatArea.scrollTop = chatArea.scrollHeight;
    } else if (packet.action === "CHANGE_NAME") {
        chatArea.appendChild(createChatInfoElement(packet.prevname + " changed their nickname to " + packet.nickname));
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});