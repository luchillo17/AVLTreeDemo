import { AVLTree } from './avltree';
import { AVLNode } from './avlnode';

describe('AVLTree', () => {
  it('should create an empty tree', () => {
    const tree = new AVLTree();
    expect(tree).toBeTruthy();
    expect(tree.root).toBeNull();
  });

  describe('Add', () => {
    let tree = new AVLTree();

    beforeEach(() => {
      tree = new AVLTree();
    });

    it('should add 1 item to empty tree', () => {
      tree.add('d');
      expect(tree.serialize()).toBe('(d)');
    });

    it('should add parameters in alphabetic order', () => {
      ['d', 'h', 'c'].forEach(char => tree.add(char));

      expect(tree.serialize()).toBe('(d(c,h))');
    });

    it('should add parameters in alphabetic order', () => {
      ['d', 'h', 'c'].forEach(char => tree.add(char));

      expect(tree.serialize()).toBe('(d(c,h))');
    });
  });

  describe('Serialize & de-serialize', () => {
    const tree = new AVLTree();
    const serializedTree = '(d(c(a(b)),h(f(e,g),p(i))))';

    beforeAll(() => {
      tree.root = new AVLNode('d');

      const c = (tree.root.left = new AVLNode('c'));
      const a = (c.left = new AVLNode('a'));
      a.right = new AVLNode('b');

      const h = (tree.root.right = new AVLNode('h'));
      const f = (h.left = new AVLNode('f'));
      const p = (h.right = new AVLNode('p'));

      f.left = new AVLNode('e');
      f.right = new AVLNode('g');

      p.left = new AVLNode('i');
    });

    it('should serialize a tree correctly', () => {
      expect(tree.serialize()).toBe(serializedTree);
    });

    it('should de-serialize a tree string correctly', () => {
      expect(new AVLTree().deSerialize(serializedTree)).toEqual(tree);
    });
  });

  describe('Add keys with auto balancing', () => {});
});
