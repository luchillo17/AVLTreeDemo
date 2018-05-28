import { AVLNode } from './avlnode';

export class AVLTree {
  nodes = 0;
  root: AVLNode = null;

  public get height(): number {
    return this.root.height;
  }

  //#region CRUD region
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
      this.nodes++;
      this.root = new AVLNode(val);
      return true;
    }

    this.root = this.addRecursive(this.root, val);

    return startingNodes < this.nodes;
  }

  private addRecursive(root: AVLNode, val: string) {
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

  private removeRecursive(root: AVLNode, val: string) {
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

  getAncestors(val: string) {
    const result: string[] = [];
    let current = this.root;

    while (current !== null) {
      result.push(current.value);
      if (current.value === val) {
        return result;
      }

      current = val < current.value ? current.left : current.right;
    }

    return null;
  }

  isFull() {
    return this.isFullRecursive(this.root);
  }

  isFullRecursive(root: AVLNode) {
    // If empty, is full
    if (root === null) {
      return true;
    }

    const children = [root.left, root.right].filter(node => node !== null);

    // If leaf, is full
    if (children.length === 0) {
      return true;
    }

    // If both children not null, check for each child
    if (children.length === 2) {
      return children.every(node => this.isFullRecursive(node));
    }

    // Only 1 children, not full
    return false;
  }

  private getMinSuccessor(root: AVLNode) {
    let current = root;

    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }

  //#endregion

  //#region ReBalance functions
  private reBalance(root: AVLNode) {
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

  private rotateRight(root: AVLNode) {
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

  private rotateLeft(root: AVLNode) {
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

  private rotateLeftRight(root: AVLNode) {
    root.left = this.rotateLeft(root.left);
    return this.rotateRight(root);
  }

  private rotateRightLeft(root: AVLNode) {
    root.right = this.rotateRight(root.right);
    return this.rotateLeft(root);
  }

  private getHeightBalance(root: AVLNode) {
    const leftHeight = root.left !== null ? root.left.height : 0;
    const rightHeight = root.right !== null ? root.right.height : 0;
    return {
      height: Math.max(leftHeight, rightHeight) + 1,
      balance: leftHeight - rightHeight,
    };
  }
  // #endregion

  //#region Serialization functions
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
  //#endregion

  //#region Traversal functions
  preOrder() {
    return this.preOrderRecursive(this.root);
  }

  inOrder() {
    return this.inOrderRecursive(this.root);
  }

  postOrder() {
    return this.postOrderRecursive(this.root);
  }

  preOrderRecursive(root: AVLNode) {
    if (root === null) {
      return '';
    }
    return [root.value, this.preOrderRecursive(root.left), this.preOrderRecursive(root.right)]
      .filter(str => str !== '')
      .join();
  }

  inOrderRecursive(root: AVLNode) {
    if (root === null) {
      return '';
    }
    return [this.inOrderRecursive(root.left), root.value, this.inOrderRecursive(root.right)]
      .filter(str => str !== '')
      .join();
  }

  postOrderRecursive(root: AVLNode) {
    if (root === null) {
      return '';
    }
    return [this.postOrderRecursive(root.left), this.postOrderRecursive(root.right), root.value]
      .filter(str => str !== '')
      .join();
  }

  traversalDFS() {
    return this.inOrder();
  }

  traversalBFS() {
    const queue: AVLNode[] = [];
    const result: string[] = [];
    queue.push(this.root);

    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current.value);

      const children = [current.left, current.right].filter(node => node !== null);
      queue.push(...children);
    }

    return result.join();
  }
  // #endregion
}
