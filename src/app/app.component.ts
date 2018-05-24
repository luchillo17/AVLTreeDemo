import { AfterViewInit, Component } from '@angular/core';
import { hierarchy, HierarchyPointLink, HierarchyPointNode, select, path, tree } from 'd3';

import { AVLNode } from './models/avlnode';
import { AVLTree } from './models/avltree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public tree = new AVLTree().deSerialize('(e(c(a,d),g(f,i(h,p))))');
  ngAfterViewInit() {
    // Transform data to D3 tree hierarchy
    const d3Tree = hierarchy(this.tree.root, node => {
      return [node.left, node.right].filter(child => child !== null);
    });

    const xSize = (d3Tree.height + 0.5) ** 2 * 50;
    const ySize = (d3Tree.height + 1) * 50;
    const treeLayout = tree<AVLNode>().size([xSize, ySize]);

    // Set svg sizes
    const treeSVG = select('#treeSVG')
      .attr('viewBox', `-30 -30 ${xSize + 30} ${ySize + 60}`)
      .style('border', '1px solid black');

    // Generate tree layout
    const nodes = treeLayout(d3Tree);

    // Populate nodes with data
    const nodeGroups = treeSVG
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
    const links = treeSVG
      .selectAll('line.link')
      .data(nodes.links(), (d: HierarchyPointLink<AVLNode>) => d.target.data.value);

    links
      .enter()
      .insert('line', 'g')
      .classed('link', true)
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
  }
}
