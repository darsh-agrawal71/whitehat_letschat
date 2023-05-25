import Message from "./MessageModel.js";
import Room from "./RoomModel.js";
import FirestoreDB from "./firebase.js";
import { get } from "./localstorage.js";

const HTML = {
    sendMessageForm: document.querySelector("form#sendMessageForm"),
    chatMessages: document.querySelector("div.chat-messages"),
};

const roomName = get("R");
const userName = get("U");


let room = new Room(roomName);

/**
 *
 * @param {Message} message
 */
function makeMessageHTML(message) {
    const chatMessage = document.createElement("div");
    const chatMessageUsername = document.createElement("div");
    const chatMessageContent = document.createElement("div");
    const chatMessageLikeButton = document.createElement("button");
    const chatMessageLikeButtonIcon = document.createElement("img");
    const chatMessageLikeCount = document.createElement("span");

    chatMessage.className = "chat-message";
    chatMessageUsername.className = "chat-message-username";
    chatMessageContent.className = "chat-message-content";
    chatMessageLikeButton.className =
        "btn btn-secondary chat-message-like-button";
    chatMessageLikeButtonIcon.className = "fas fa-thumbs-up";
    chatMessageLikeCount.className = "chat-message-like-count";

    chatMessageLikeButton.addEventListener("click", function (e) {
        FirestoreDB.addLike(room, message);
    });

    chatMessageUsername.innerHTML = message.username;
    chatMessage.appendChild(chatMessageUsername);

    chatMessageContent.innerHTML = message.content;
    chatMessage.appendChild(chatMessageContent);

    chatMessageLikeButton.appendChild(chatMessageLikeButtonIcon);
    chatMessageLikeButton.innerHTML += " Like";
    chatMessage.appendChild(chatMessageLikeButton);

    chatMessageLikeCount.innerHTML = "0";
    chatMessage.appendChild(chatMessageLikeCount);

    return chatMessage;

    /*
    
        <div class="chat-message">
                    <div class="chat-message-username">John Doe</div>
                    <div class="chat-message-content">Hello world!</div>
                    <button
                        type="button"
                        class="btn btn-secondary chat-message-like-button"
                    >
                        <i class="fas fa-thumbs-up"></i> Like
                    </button>
                    <span class="chat-message-like-count">0</span>
                </div>
    */
}

FirestoreDB.getMessages(room, (msg) => {
    console.log(msg)
}).then(({data, unsubscribe}) => {
    data.forEach(msg => HTML.chatMessages.appendChild(makeMessageHTML(msg)))

})
//data.forEach(function ({ data, realtime }) {
    
//}));

HTML.sendMessageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user_message = new FormData(this).get("message");
    const message = new Message(userName, user_message);
    HTML.chatMessages.appendChild(makeMessageHTML(message));
    FirestoreDB.addMessage(message, room);
});
