import { AfterViewInit, Component } from '@angular/core';
import { curveNatural, hierarchy, HierarchyPointLink, HierarchyPointNode, line, select, Selection, tree } from 'd3';

import { AVLNode } from './models/avlnode';
import { AVLTree } from './models/avltree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public tree = new AVLTree().deSerialize('(e(c(a,d),g(f,i(h,p))))');

  public treeSVG: Selection<SVGElement, HierarchyPointNode<AVLNode>, HTMLElement, any>;
  public lineGen = line<HierarchyPointNode<AVLNode>>()
    .curve(curveNatural)
    .x(d => d.x)
    .y(d => d.y);

  ngAfterViewInit() {
    this.treeSVG = select('#treeSVG');

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

    // Configure group content (g, circle, text, link)
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

    // Populate Links elements
    const links = this.treeSVG
      .selectAll('path.link')
      .data(nodes.links(), (d: HierarchyPointLink<AVLNode>) => d.target.data.value);

    links
      .enter()
      .insert('path', 'g')
      .classed('link', true)
      .attr('d', (d: HierarchyPointLink<AVLNode>) => this.lineGen([d.source, d.target]));
  }
}
