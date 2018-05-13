import { AVLTree } from './avltree';
import { AVLNode } from './avlnode';

describe('AVLTree', () => {
  it('should create an empty tree', () => {
    const tree = new AVLTree();
    expect(tree).toBeTruthy();
    expect(tree.root).toBeNull();
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

  describe('Add', () => {
    let tree: AVLTree;

    beforeEach(() => {
      tree = new AVLTree();
    });

    it('should add 1 item to empty tree', () => {
      tree.add('d');
      expect(tree.serialize()).toBe('(d)');
    });

    it('should add unordered parameters in alphabetic order', () => {
      ['d', 'h', 'c'].forEach(char => tree.add(char));

      expect(tree.serialize()).toBe('(d(c,h))');
    });
  });

  describe('Add Auto Balancing', () => {
    let tree: AVLTree;
    beforeEach(() => {
      tree = new AVLTree();
    });

    it('should do rotation right at root', () => {
      tree.add('c');
      tree.add('b');
      expect(tree.serialize()).toBe('(c(b))');

      tree.add('a');
      expect(tree.serialize()).toBe('(b(a,c))');
    });

    it('should do rotation left at root', () => {
      tree.add('a');
      tree.add('b');
      expect(tree.serialize()).toBe('(a(b))');

      tree.add('c');
      expect(tree.serialize()).toBe('(b(a,c))');
    });

    it('should do rotation right at root big tree', () => {
      tree.add('e');
      tree.add('c');
      tree.add('f');
      tree.add('b');
      tree.add('d');
      expect(tree.serialize()).toBe('(e(c(b,d),f))');

      tree.add('a');
      expect(tree.serialize()).toBe('(c(b(a),e(d,f)))');
    });

    it('should do rotation left at root big tree', () => {
      tree.add('b');
      tree.add('a');
      tree.add('d');
      tree.add('c');
      tree.add('e');
      expect(tree.serialize()).toBe('(b(a,d(c,e)))');

      tree.add('f');
      expect(tree.serialize()).toBe('(d(b(a,c),e(f)))');
    });

    describe('should do double rotation right at root', () => {
      it('Fb(R) = 0', () => {
        tree = new AVLTree();

        tree.add('c');
        tree.add('a');
        expect(tree.serialize()).toBe('(c(a))');

        tree.add('b');
        expect(tree.serialize()).toBe('(b(a,c))');
      });

      beforeEach(() => {
        tree.add('e');
        tree.add('b');
        tree.add('f');
        tree.add('a');
      });

      it('Fb(R) = 1', () => {
        expect(tree.serialize()).toBe('(e(b(a),f))');

        tree.add('d');
        tree.add('c');
        expect(tree.serialize()).toBe('(d(b(a,c),e(f)))');
      });

      it('Fb(R) = -1', () => {
        expect(tree.serialize()).toBe('(e(b(a),f))');

        tree.add('c');
        tree.add('d');
        expect(tree.serialize()).toBe('(c(b(a),e(d,f)))');
      });
    });

    describe('should do double rotation left at root', () => {
      it('Fb(R) = 0', () => {
        tree = new AVLTree();

        tree.add('a');
        tree.add('c');
        expect(tree.serialize()).toBe('(a(c))');

        tree.add('b');
        expect(tree.serialize()).toBe('(b(a,c))');
      });

      beforeEach(() => {
        tree.add('b');
        tree.add('a');
        tree.add('e');
        tree.add('f');
      });

      it('Fb(R) = 1', () => {
        expect(tree.serialize()).toBe('(b(a,e(f)))');

        tree.add('d');
        tree.add('c');
        expect(tree.serialize()).toBe('(d(b(a,c),e(f)))');
      });

      it('Fb(R) = -1', () => {
        expect(tree.serialize()).toBe('(b(a,e(f)))');

        tree.add('c');
        tree.add('d');
        expect(tree.serialize()).toBe('(c(b(a),e(d,f)))');
      });
    });

    it('should do rotation right at nested tree', () => {
      pending();
    });

    it('should do rotation left at nested tree', () => {
      pending();
    });

    it('should do double rotation right at nested tree', () => {
      pending();
    });

    it('should do double rotation left at nested tree', () => {
      pending();
    });
  });
});
