import Room from "./RoomModel.js";
import Message from "./MessageModel.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import * as firestore from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import {
    collection as c,
    query as q,
    doc as d,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCI7ZXkQB2acR-mo_gMpap3sNrTUDkfOtI",
    authDomain: "kwitter-191d6.firebaseapp.com",
    projectId: "kwitter-191d6",
    storageBucket: "kwitter-191d6.appspot.com",
    messagingSenderId: "260921766525",
    appId: "1:260921766525:web:93d32261d25cd33f863714",
    measurementId: "G-5JB4ZQWK0F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firestore.getFirestore(app);
/* DATA

- Rooms
    - Cat
        name: cat
    - Dog
        name: dog
    - Panda
        name: panda

- Messages
    - Cat
        - Messages
            - RandomID
                text: string
                user: string // user who sent the message
    - Panda
            
*/
const ROOM_COL = "Rooms";
const MESSAGE_COL = "Messages";

export default class FirestoreDB {
    /**
     * @returns {Promise<Room[]>}
     */
    static async getRooms() {
        let array = [];
        const data = await firestore.getDocs(c(db, ROOM_COL));
        data.forEach(function (room) {
            array.push(Room.fromJSON(room.data()));
        });

        return array;
    }

    /**
     *
     * @param {Room} room
     * @returns {Promise<void>}
     */
    static async addRoom(room) {
        await firestore.setDoc(d(db, ROOM_COL, room.name), room.getAsJSON());
        await firestore.setDoc(
            d(db, MESSAGE_COL, room.name, MESSAGE_COL, "_PURPOSE"),
            { purpose: "creation of room" }
        );
    }

    /**
     *
     * @param {Room} room
     * @returns {string}
     */
    static getMessagePath(room) {
        return `${MESSAGE_COL}/${room.name}/${MESSAGE_COL}`;
    }

    /**
     *
     * @param {Message} message
     * @param {Promise<Room>} room
     */
    static async addMessage(message, room) {
        await firestore.addDoc(
            c(db, this.getMessagePath(room)),
            message.getAsJSON()
        );
    }

    /**
     *
     * @param {Room} room
     * @param {(doc: unknown) => void} onRealtime
     * @returns {Promise<{data: Message[], realtime: unknown}>}
     */
    static async getMessages(room, onRealtime) {
        let array = [];
        const data = await firestore.getDocs(c(db, this.getMessagePath(room)));
        data.forEach(function (message) {
            array.push(Message.fromJSON(message.data()));
        });

        return {
            data: array,
            realtime: firestore.onSnapshot(
                q(c(db, this.getMessagePath(room))),
                onRealtime
            ),
        };
    }

    /**
     *
     * @param {Room} room
     * @param {Message} message
     * @returns {Promise<void>}
     */
    static async addLike(room, message) {
        await firestore.updateDoc(d(db, this.getMessagePath(room)), {
            likes: firestore.increment(1)
        });
    }
}
