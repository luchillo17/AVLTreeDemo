import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { curveNatural, hierarchy, HierarchyPointLink, HierarchyPointNode, line, select, Selection, tree } from 'd3';

import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { AVLNode } from './models/avlnode';
import { AVLTree } from './models/avltree';
import { MessageDialogData } from './message-dialog/message-dialog.interfaces';

type SVGSelection = Selection<SVGElement, HierarchyPointNode<AVLNode>, HTMLElement, any>;
type NodeSelection = Selection<SVGElement, HierarchyPointNode<AVLNode>, SVGElement, any>;
type LinkSelection = Selection<SVGElement, HierarchyPointLink<AVLNode>, SVGElement, any>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public tree = new AVLTree().deSerialize('(e(c(a,d),g(f,i(h,p))))');

  public treeSVG: SVGSelection;
  public lineGen = line<HierarchyPointNode<AVLNode>>()
    .curve(curveNatural)
    .x(d => d.x)
    .y(d => d.y);

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.treeSVG = select('#treeSVG');
    this.updateTree();
  }

  //#region CRUD functions
  addKey(input: HTMLInputElement) {
    if (!input.value) {
      return;
    }
    this.tree.add(input.value);
    input.value = '';
    this.updateTree();
  }

  removeKey(input: HTMLInputElement) {
    if (!input.value) {
      return;
    }
    this.tree.remove(input.value);
    input.value = '';
    this.updateTree();
  }

  findKey(input: HTMLInputElement) {
    if (!input.value) {
      return;
    }
    const nodeCircle = this.treeSVG
      .selectAll('g.node')
      .filter((d: HierarchyPointNode<AVLNode>) => d.data.value === input.value)
      .select('circle')
      .style('fill', 'greenyellow');

    setTimeout(() => {
      nodeCircle.style('fill', null);
    }, 2500);

    input.value = '';
  }
  //#endregion

  //#region Traversal functions
  showBFSTraversal() {
    const text = this.tree.traversalBFS();
    this.dialogWithText({ title: 'BFS Traversal result', text });
  }
  showDFSTraversal() {
    const text = this.tree.traversalDFS();
    this.dialogWithText({ title: 'DFS Traversal result', text });
  }

  showInOrderTraversal() {
    const text = this.tree.inOrder();
    this.dialogWithText({ title: 'In-Order Traversal Result', text });
  }

  showPreOrderTraversal() {
    const text = this.tree.preOrder();
    this.dialogWithText({ title: 'Pre-Order Traversal Result', text });
  }
  showPostOrderTraversal() {
    const text = this.tree.postOrder();
    this.dialogWithText({ title: 'Post-Order Traversal result', text });
  }
  //#endregion

  dialogWithText({ title = 'Result', text }: MessageDialogData) {
    this.dialog.open(MessageDialogComponent, {
      data: {
        text,
        title,
      },
    });
  }

  //#region D3 data visualization functions
  updateTree() {
    // Transform data to D3 tree hierarchy
    const d3Tree = hierarchy(this.tree.root, node => {
      return [node.left, node.right].filter(child => child !== null);
    });

    const xSize = (d3Tree.height + 0.5) ** 2 * 50;
    const ySize = (d3Tree.height + 1) * 50;
    const treeLayout = tree<AVLNode>().size([xSize, ySize]);

    // Set svg sizes
    this.treeSVG.attr('viewBox', `-30 -30 ${xSize + 30} ${ySize + 60}`);

    // Generate tree layout
    const nodes = treeLayout(d3Tree);

    // Populate nodes with data
    const nodeGroups = this.treeSVG
      .selectAll('g.node')
      .data(nodes.descendants(), (d: HierarchyPointNode<AVLNode>) => d.data.value);

    this.updateNodes(nodeGroups as NodeSelection);

    // Populate Links elements
    const links = this.treeSVG
      .selectAll('path.link')
      .data(nodes.links(), (d: HierarchyPointLink<AVLNode>) => d.target.data.value);

    this.updateLinks(links as LinkSelection);
  }

  updateNodes(nodeGroups: NodeSelection) {
    // Insert new nodes (g, circle, text)
    const nodeGroupEnter = nodeGroups
      .enter()
      .append('g')
      .classed('node', true)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    nodeGroupEnter.append('circle');
    nodeGroupEnter
      .append('text')
      .attr('x', 0)
      .attr('y', 5)
      .text(d => d.data.value);

    // Update position for existing ones
    nodeGroups
      .transition()
      .duration(1000)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .select('text')
      .text(d => d.data.value);

    // Remove nodes deleted from tree
    nodeGroups
      .exit()
      .transition()
      .duration(1000)
      .attr('opacity', 0)
      .remove();
  }

  updateLinks(links: LinkSelection) {
    // Insert new links
    links
      .enter()
      .insert('path', 'g')
      .classed('link', true)
      .attr('d', (d: HierarchyPointLink<AVLNode>) => this.lineGen([d.source, d.target]));

    // Update paths for existing links
    links
      .transition()
      .duration(1000)
      .attr('d', (d: HierarchyPointLink<AVLNode>) => this.lineGen([d.source, d.target]));

    // Remove links of deleted nodes from tree
    links
      .exit()
      .transition()
      .duration(1000)
      .attr('opacity', 0)
      .remove();
  }
  //#endregion
}
