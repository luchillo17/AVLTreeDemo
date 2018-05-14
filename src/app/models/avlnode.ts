export class AVLNode {
  height = 1;

  left: AVLNode = null;
  right: AVLNode = null;

  constructor(public value: string = null) {}
}
