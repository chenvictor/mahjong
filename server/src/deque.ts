/**
 * Simplex deque that only supports item removal
 */
import {Index} from "./shared/types";

export class Deque<T> {
  private readonly array: T[];
  private front: Index;
  private back: Index;
  constructor(array: T[]) {
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
