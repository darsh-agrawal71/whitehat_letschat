export default class Room {
    constructor(name) {
        this.name = name;
    }

    getName() { return this.name; }
    setName(name) { this.name = name;}
    getAsJSON() { return {...this}}
    static fromJSON({name}) { return new Room(name) }
}   