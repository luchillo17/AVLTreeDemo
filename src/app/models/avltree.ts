import { AVLNode } from './avlnode';

export class AVLTree {
  root: AVLNode = null;

  add(val: string) {
    if (this.root === null) {
      this.root = new AVLNode(val);
      return;
    }
    this.addRecursive(this.root, val);
  }

  addRecursive(root: AVLNode, val: string) {
    if (root === null || root.value === val) {
      return;
    }

    let current: AVLNode;
    if (val < root.value) {
      current = root.left !== null ? root.left : new AVLNode(val);
      root.left = current;
    } else {
      current = root.right !== null ? root.right : new AVLNode(val);
      root.right = current;
    }

    this.addRecursive(current, val);
  }

  recalculateTreeHeights(root: AVLNode) {
    throw new Error('Not yet implemented');
  }

  recalculateAncestorHeights(node: AVLNode) {
    throw new Error('Not yet implemented');
  }

  serialize(): string {
    return `(${this.serializeRecursive(this.root)})`;
  }

  private serializeRecursive(root: AVLNode) {
    if (root === null) {
      return null;
    }

    const children = [this.serializeRecursive(root.left), this.serializeRecursive(root.right)]
      .filter(s => s !== null)
      .join(',');

    if (children === '') {
      return root.value;
    }

    return `${root.value}(${children})`;
  }

  deSerialize(str: string): AVLTree {
    const chars = str
      .slice(1, str.length - 1)
      .split(/[\(),]/)
      .filter(s => s !== '');

    for (const char of chars) {
      this.add(char);
    }

    return this;
  }
}
