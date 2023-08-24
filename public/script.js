const socket = io();
let username;

//const form = document.querySelector('.chat-input');
const input = document.querySelector('.chat-input input');
const messages = document.querySelector('.chat-messages');

do {
    username = prompt("Please enter your username:");
} while (!username);

document.querySelector('.sidebar h1').textContent = username;
socket.emit("user joined", username);

const sendMessage = () => {
    if (input.value.trim() !== '') {
        const words = input.value.split(' ');
        const emoji = {
            "react": "⚛️",
            "woah": "😮",
            "hey": "👋",
            "lol": "😂",
            "like": "❤️",
            "congratulations": "🎉"
        }
        let output ='';
        words.forEach(word => {
            if(emoji[word]){
                word = emoji[word];
            }
            output = output + ' ' + word;
        })
        socket.emit('chat message', output);
        input.value = '';
    }
}

document.querySelector('.chat-input button').addEventListener('click', sendMessage);
input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

socket.on('update userlist', (userlist) => {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = "";
    userlist.forEach(user => {
        const contactItem = document.createElement("li");
        contactItem.className = "contact";

        const contactNameSpan = document.createElement("span");
        contactNameSpan.className = "contact-name";
        contactNameSpan.textContent = user;

        contactItem.appendChild(contactNameSpan);
        chatList.appendChild(contactItem);
    });
})

socket.on('chat message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messageElement.className = "message received";
    messages.appendChild(messageElement);
});