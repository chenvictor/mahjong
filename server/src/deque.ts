/**
 * Simplex deque that only supports item removal
 */
import {Index} from "../../js/types";

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
    return this.array[this.front++];
  }
  popBack() {
    return this.array[--this.back];
  }
}
