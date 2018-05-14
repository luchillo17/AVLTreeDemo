import { AVLNode } from './avlnode';

export class AVLTree {
  root: AVLNode = null;

  add(val: string) {
    if (this.root === null) {
      this.root = new AVLNode(val);
      return;
    }
    this.root = this.addRecursive(this.root, val);
  }

  addRecursive(root: AVLNode, val: string) {
    // Root null means insertion point
    if (root === null) {
      return new AVLNode(val);
    }

    // Same value return this root since found value
    if (root.value === val) {
      return root;
    }

    // Normal BST insert
    if (val < root.value) {
      root.left = this.addRecursive(root.left, val);
    } else {
      root.right = this.addRecursive(root.right, val);
    }

    return this.reBalance(root, val);
  }

  reBalance(root: AVLNode, val: string) {
    // Update this ancestor height & get balance
    const { balance, height } = this.getHeightBalance(root);
    root.height = height;

    // Check rotation cases based on balance & direction in child of inserted value

    // Right rotation, value inserted to the left of the left node
    if (balance > 1 && val < root.left.value) {
      return this.rotateRight(root);
    }

    // Double right rotation (better described as left->right rotation),
    // value inserted to the right of the left node
    if (balance > 1 && val > root.left.value) {
    }

    // Left rotation, value inserted to the right of the right node
    if (balance < -1 && val > root.right.value) {
      return this.rotateLeft(root);
    }
    // Double left rotation (better described as right->left rotation),
    // value inserted to the left of the left node
    if (balance < -1 && val < root.right.value) {
    }

    // No balance happened, return the same root.
    return root;
  }

  rotateRight(root: AVLNode) {
    // Pivot for rotation is the left node of root
    const pivot = root.left;

    // Rotate right from pivot
    root.left = pivot.right;
    pivot.right = root;

    // Recalculate heights of root & then pivot
    root.height = this.getHeightBalance(root).height;
    pivot.height = this.getHeightBalance(pivot).height;
    return pivot;
  }

  rotateLeft(root: AVLNode) {
    // Pivot for rotation is the right node of root
    const pivot = root.right;

    // Rotate left from pivot
    root.right = pivot.left;
    pivot.left = root;

    // Recalculate heights of root & then pivot
    root.height = this.getHeightBalance(root).height;
    pivot.height = this.getHeightBalance(pivot).height;
    return pivot;
  }

  getHeightBalance(root: AVLNode) {
    const leftHeight = root.left !== null ? root.left.height : 0;
    const rightHeight = root.right !== null ? root.right.height : 0;
    return {
      height: Math.max(leftHeight, rightHeight) + 1,
      balance: leftHeight - rightHeight,
    };
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
