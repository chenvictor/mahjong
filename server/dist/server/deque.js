"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deque = void 0;
class Deque {
    constructor(array) {
        this.array = array;
        this.front = 0;
        this.back = array.length;
    }
    getSize() {
        return this.back - this.front;
    }
    popFront() {
        if (this.getSize() <= 0) {
            console.error('deque popFront but empty!');
        }
        return this.array[this.front++];
    }
    popBack() {
        if (this.getSize() <= 0) {
            console.error('deque popBack but empty!');
        }
        return this.array[--this.back];
    }
}
exports.Deque = Deque;
//# sourceMappingURL=deque.js.map