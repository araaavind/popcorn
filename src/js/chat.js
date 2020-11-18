const chatOpenButton = document.getElementById('chatOpenButton');
const chatRoom = document.getElementById('chatRoom');
const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const unreadBadge = document.getElementById('unreadBadge');
let unreadCount = 0;

chatOpenButton.addEventListener("click", (e) => {
    let icon = chatOpenButton.querySelector('i');
    icon.classList.toggle("fa-comment-slash");
    icon.classList.toggle("fa-comments");
    chatOpenButton.classList.toggle("player-button-active");
    if (chatRoom.style.visibility === "hidden") {
        chatRoom.style.visibility = "visible";
        unreadCount = 0;
        unreadBadge.style.visibility = "hidden";
    }
    else {
        chatRoom.style.visibility = "hidden";
    }
    messageInput.focus();
    chatArea.scrollTop = chatArea.scrollHeight;
});

document.addEventListener('keyup', (e) => {
    if ((e.code === "keyQ" || e.key === "q" || e.keyCode === 81) && e.ctrlKey && packet.sessionId) {
        let icon = chatOpenButton.querySelector('i');
        icon.classList.toggle("fa-comment-slash");
        icon.classList.toggle("fa-comments");
        chatOpenButton.classList.toggle("player-button-active");
        if (chatRoom.style.visibility === "hidden") {
            chatOpenButton.style.visibility = "visible";
            chatRoom.style.visibility = "visible";
            unreadCount = 0;
            unreadBadge.style.visibility = "hidden";
        }
        else {
            chatRoom.style.visibility = "hidden";
        }
        messageInput.focus();
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});

function createMessageElement(packet, type) {
    let messageContainer = document.createElement('div');
    let messageAuthorSpan = document.createElement('span');
    let messageContentSpan = document.createElement('span');
    messageAuthorSpan.setAttribute('class', "message-author");
    messageContentSpan.setAttribute('class', "message-content");
    messageContentSpan.textContent = stringToEmoji(packet.message);

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
    if (messageInput.value == "" || messageInput.value == undefined || messageInput.value == " ") {
        return;
    }
    if (!packet.sessionId) {
        let alert = new Alert();
        alert.display("There's no one in this party");
        return;
    }
    packet.message = messageInput.value;
    messageInput.value = "";
    packet.action = "MESSAGE";
    socket.emit('message', packet);

    chatArea.appendChild(createMessageElement(packet, "SENT"));
    chatArea.scrollTop = chatArea.scrollHeight;
});

messageInput.addEventListener('input', () => {
    let x = messageInput.value;
    if (x === "") {
        if (packet.typing) {
            packet.typing = false;
            socket.emit('typing_indicator', packet);
        }
    } else {
        packet.typing = true;
        socket.emit('typing_indicator', packet);
    }
});

messageInput.addEventListener('keyup', (e) => {
    if (e.code === "Enter" || e.key === "Enter" || e.keyCode === 13) {
        e.stopPropagation();
        if (packet.typing) {
            packet.typing = false;
            socket.emit('typing_indicator', packet);
        }
    }
});

socket.on('typing_indicator', (packet) => {
    let typingSpan = document.getElementById('typing-indicator');
    if (packet.typing) {
        typingSpan.style.display = "block";
        typingSpan.textContent = packet.nickname + " is typing...";
    } else {
        typingSpan.style.display = "none";
    }
});

socket.on('message', (packet) => {
    if(chatRoom.style.visibility === "hidden") {
        unreadCount += 1;
        unreadBadge.textContent = unreadCount;
        unreadBadge.style.visibility = "visible";
        chatOpenButton.style.visibility = "visible";
    }
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

function stringToEmoji(message) {
    const emojiMap = {
        'o/': '👋',
        '</3': '💔',
        '<3': '💗',
        '8-D': '😁',
        '8D': '😁',
        ':-D': '😁',
        '=-3': '😁',
        '=-D': '😁',
        '=3': '😁',
        '=D': '😁',
        'B^D': '😁',
        'X-D': '😂',
        'XD': '🤣',
        'x-D': '😂',
        'xD': '🤣',
        ':\')': '😂',
        ':\'-)': '😂',
        ';\'-)': '😂',
        ':-))': '😃',
        '8)': '😎',
        '8-)': '😎',
        'B)': '😎',
        'B-)': '😎',
        'BD': '😎',
        ':)': '😃',
        ':-)': '🥰',
        ':3': '😄',
        ':D': '😁',
        ':]': '😄',
        ':^)': '😄',
        ':c)': '😄',
        ':o)': '😄',
        ':}': '😚',
        ':っ)': '😄',
        '=)': '😄',
        '=]': '😄',
        '0:)': '😇',
        '0:-)': '😇',
        '0:-3': '😇',
        '0:3': '😇',
        '0;^)': '😇',
        'O:-)': '😇',
        '3)': '😔',
        '3-)': '😔',
        ':3)': '😍',
        '<3)': '😍',
        '(^)': '🔥',
        '{^}': '🔥',
        '3:)': '😈',
        '3:-)': '😈',
        '}:)': '😈',
        '}:-)': '😈',
        '*)': '😉',
        '*-)': '😉',
        ':-,': '😉',
        ';)': '😉',
        ';-)': '😉',
        ';-]': '😉',
        ';D': '😉',
        ';]': '😉',
        ';^)': '😉',
        ':-|': '😐',
        ':|': '😐',
        ':(': '🙁',
        ':-(': '😢',
        ':-<': '😒',
        ':-[': '😒',
        ':-c': '😒',
        ':<': '😒',
        ':[': '😒',
        ':c': '😒',
        ':{': '😒',
        ':っC': '😒',
        '%)': '😖',
        '%-)': '😖',
        ':-P': '😜',
        ':-b': '😜',
        ':-p': '😜',
        ':-Þ': '😜',
        ':-þ': '😜',
        ':P': '😛',
        ':b': '😛',
        ':p': '😛',
        ':Þ': '😜',
        ':þ': '😜',
        ';(': '😥',
        ';\'(': '😭',
        ';\'-(': '😭',
        '=p': '😜',
        'X-P': '😝',
        'XP': '😝',
        'd:': '😜',
        'x-p': '😝',
        'xp': '😝',
        'xP': '😝',
        'Xp': '😝',
        ':-||': '😠',
        ':@': '🤬',
        ':-.': '😡',
        ':-/': '😡',
        ':/': '😡',
        ':L': '😡',
        ':S': '😡',
        ':\\': '😡',
        '=/': '😡',
        '=L': '😡',
        '=\\': '😡',
        ':\'(': '😢',
        ':\'-(': '😢',
        '^5': '😤',
        '^<_<': '😤',
        'o/\\o': '😤',
        '|-O': '😫',
        '|;-)': '😫',
        ':###..': '😰',
        ':-###..': '😰',
        'D-\':': '😱',
        'D8': '😱',
        'D:': '😱',
        'D:<': '😱',
        'D;': '😱',
        'D=': '😱',
        'DX': '😱',
        'v.v': '😱',
        '8-0': '😲',
        ':-O': '😲',
        ':-o': '😯',
        ':O': '😲',
        ':o': '😮',
        'O-O': '🙄',
        'O_O': '😳',
        'O_o': '🧐',
        'o-o': '😲',
        'o_O': '🧐',
        'o_o': '😳',
        ':$': '😳',
        ':-': '😶',
        ':-\'': '😪',
        ':-"': '😪',
        '-_-': '😑',
        '=_=': '😑',
        '#-)': '😵',
        ':#': '😶',
        ':&': '😶',
        ':-#': '😶',
        ':-&': '😶',
        ':-X': '🤭',
        ':-x': '🤭',
        ':X': '🤧',
        ':J': '😏',
        ':-J': '😏',
        ':j': '😏',
        ':-j': '😏',
        ':*': '😽',
        ':^*': '😽',
        'ಠ_ಠ': '🙅',
        '*\\0/*': '🙆',
        '\\o/': '🙆',
        ':>': '😄',
        '>.<': '😡',
        '>:(': '😠',
        '>:)': '😈',
        '>:-)': '😈',
        '>:/': '😡',
        '>:O': '😲',
        '>:P': '😜',
        '>:[': '😒',
        '>:\\': '😡',
        '>;)': '😈',
        '>_>^': '😤'
    };
    Object.keys(emojiMap)
        .sort((a, b) => b.length - a.length)
        .forEach(key => {
            message = message.replaceAll(key, emojiMap[key]);
        });
    return message;
}