export default class Message {
    constructor(username, content, likes = 0) {
        this.username = username;
        this.content = content;
        this.likes = likes;
    }

    getUsername() {
        return this.username;
    }
    getContent() {
        return this.content;
    }
    getLikes() {
        return this.likes;
    }
    setUsername(username) {
        this.username = username;
    }
    setContent(content) {
        this.content = content;
    }
    setLikes(likes) {
        this.likes = likes;
    }
    getAsJSON() {
        return { ...this };
    }
    
    static fromJSON({username, content, likes }) {
        return new Message(username, content, likes)
    }
}
