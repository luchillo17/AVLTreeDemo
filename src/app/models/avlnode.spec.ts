import { AVLNode } from './avlnode';

describe('AVLNode', () => {
  it('should create an empty node', () => {
    const node = new AVLNode();
    expect(node).toBeTruthy();
    expect(node.value).toBeNull();
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  it('should create a node with value & height', () => {
    const node = new AVLNode('x');
    expect(node).toBeTruthy();
    expect(node.value).toBe('x');
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
    expect(node.height).toBe(0);

    for (let i = 0; i < 3; i++) {
      node.height = i;
      expect(node.height).toBe(i);
    }
  });

  it('should allow to set left & right nodes', () => {
    const nodes = ['y', 'x', 'z'].map(str => new AVLNode(str));
    const [root, left, right] = nodes;

    for (const node of nodes) {
      expect(node).toBeTruthy();
      expect(node.left).toBeNull();
      expect(node.right).toBeNull();
    }

    expect(root.value).toBe('y');
    expect(left.value).toBe('x');
    expect(right.value).toBe('z');

    root.left = left;
    root.right = right;

    expect(root.left).toBe(left);
    expect(root.right).toBe(right);
  });
});
