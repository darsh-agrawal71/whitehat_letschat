import { get, save, remove } from "./localstorage.js";
import FirestoreDB from "./firebase.js";
import Room from "./RoomModel.js";

const HTML = {
    chatRooms: document.querySelector("div.chat-rooms"),
    greet: document.querySelector("em#greet"),
    addRoomForm: document.querySelector("form#addRoomForm"),
    logout: document.querySelector("button#logout"),
};

/**
 *
 * @param {Room} room
 * @returns {HTMLDivElement}
 */
function makeRoomHTML(room) {
    const chatRoom = document.createElement("div");
    const header = document.createElement("h2");
    const headerStrong = document.createElement("strong");
    const joinRoom = document.createElement("button");
    const joinRoomBold = document.createElement("b");

    chatRoom.className = "chat-room";
    joinRoom.className = "btn btn-warning float-right";

    joinRoom.addEventListener("click", function (e) {
        save('R', room.name)
        location = '../page.html'
    });

    headerStrong.innerHTML = room.name;
    header.appendChild(headerStrong);

    joinRoomBold.innerHTML = "Join room";
    joinRoom.appendChild(joinRoomBold);

    chatRoom.appendChild(header);
    chatRoom.appendChild(joinRoom);

    return chatRoom;

    // <div class="chat-room">
    //     <h2><strong>${room.name}</strong></h2>
    //     <button class="btn btn-primary float-right">
    //         <b>Join room</b>
    //     </button>
    // </div>
}

const username = get("U");

HTML.greet.innerHTML = username;

HTML.addRoomForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const roomName = new FormData(this).get("roomName");
    const room = new Room(roomName);
    console.log(room.getAsJSON(), roomName);

    HTML.chatRooms.appendChild(makeRoomHTML(room));

    FirestoreDB.addRoom(room);
});

HTML.logout.addEventListener("click", function (e) {
    remove("U");
    location = "../index.html";
});

const rooms = await FirestoreDB.getRooms();

rooms.forEach(function (room) {
    HTML.chatRooms.appendChild(makeRoomHTML(room));
});
