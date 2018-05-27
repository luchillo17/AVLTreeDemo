import { AVLNode } from './avlnode';

export class AVLTree {
  nodes = 0;
  root: AVLNode = null;

  public get height(): number {
    return this.root.height;
  }

  /**
   * Calls the recursive add algorithm
   *
   * @param {string} val string to add to tree
   * @returns {boolean} If the value was inserted returns true, if existed false
   * @memberof AVLTree
   */
  add(val: string): boolean {
    const startingNodes = this.nodes;

    if (this.root === null) {
      this.root = new AVLNode(val);
      return true;
    }

    this.root = this.addRecursive(this.root, val);

    return startingNodes < this.nodes;
  }

  addRecursive(root: AVLNode, val: string) {
    // Root null means insertion point
    if (root === null) {
      this.nodes++;
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

    return this.reBalance(root);
  }

  remove(val: string) {
    const startingNodes = this.nodes;

    if (this.root === null) {
      return false;
    }

    this.root = this.removeRecursive(this.root, val);

    return startingNodes > this.nodes;
  }

  removeRecursive(root: AVLNode, val: string) {
    // Root null means nothing to delete
    if (root === null) {
      return root;
    }

    // If no same value, just keep searching
    if (val < root.value) {
      root.left = this.removeRecursive(root.left, val);
    } else if (val > root.value) {
      root.right = this.removeRecursive(root.right, val);
    } else {
      /**
       * Same value then delete like this:
       * 1. If no child or only one, return said child.
       * 2. If 2 children, get minimum right successor,
       *    replace value in root & delete that minimum
       *    value of right subtree.
       */
      if (root.left === null) {
        this.nodes--;
        return root.right;
      }
      if (root.right === null) {
        this.nodes--;
        return root.left;
      }

      const rightMinNode = this.getMinSuccessor(root.right);

      root.value = rightMinNode.value;

      root.right = this.removeRecursive(root.right, rightMinNode.value);
    }

    return this.reBalance(root);
  }

  getMinSuccessor(root: AVLNode) {
    let current = root;

    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }

  reBalance(root: AVLNode) {
    // Update this ancestor height & get balance
    const { balance, height } = this.getHeightBalance(root);
    root.height = height;

    // Check rotation cases based on balance & direction in child of inserted value

    // Right rotation, balance of left node positive means unbalanced to the left
    if (balance > 1 && this.getHeightBalance(root.left).balance >= 0) {
      return this.rotateRight(root);
    }

    // Double right rotation (better described as left->right rotation),
    // left node unbalanced to the right
    if (balance > 1 && this.getHeightBalance(root.left).balance < 0) {
      return this.rotateLeftRight(root);
    }

    // Left rotation, balance of the right node 0 or lower means unbalanced to the right
    if (balance < -1 && this.getHeightBalance(root.right).balance <= 0) {
      return this.rotateLeft(root);
    }
    // Double left rotation (better described as right->left rotation),
    // right node unbalanced to the left
    if (balance < -1 && this.getHeightBalance(root.right).balance > 0) {
      return this.rotateRightLeft(root);
    }

    // No balance happened, return same root.
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

  rotateLeftRight(root: AVLNode) {
    root.left = this.rotateLeft(root.left);
    return this.rotateRight(root);
  }

  rotateRightLeft(root: AVLNode) {
    root.right = this.rotateRight(root.right);
    return this.rotateLeft(root);
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
