import { Injectable } from '@angular/core';
import { Info } from './info.model';

import { Node } from './node.model';

@Injectable({
  providedIn: 'root'
})
export class WaweAlgorithmService {

  private nodes: Node[][] = [];
  private startNode: Node = new Node(0, 0, false, false);
  private endNode: Node = new Node(0, 0, false, false);
  private openNodes: Node[] = [];
  private closeNodes: Node[] = [];
  public shortestPath: Node[] = [];

  constructor() {}

  initializeGrid(nodes: Node[][]): void {
    this.nodes = nodes;

    this.searchStartNode();
    this.searchEndNode();
  }

  searchStartNode(): void {
    for (let i = 0; i < this.nodes.length; i++) {
      let row = this.nodes[i];

      for (let j = 0; j < row.length; j++) {
        if (this.nodes[i][j].isStart) {
          this.startNode = this.nodes[i][j];
        }
      }
    }
  }

  searchEndNode(): void {
    for (let i = 0; i < this.nodes.length; i++) {
      let row = this.nodes[i];

      for (let j = 0; j < row.length; j++) {
        if (this.nodes[i][j].isFinish) {
          this.endNode = this.nodes[i][j];
          console.log(this.endNode)
        }
      }
    }
  }

  start(): void {
    this.openNodes.push(this.startNode)

    while (this.openNodes.length !== 0) {
      let currentNode = this.findNodeWithLowestSum();

      if (currentNode.row === this.endNode.row && currentNode.column === this.endNode.column) {
        console.log("DONE!!!");

        let temp = currentNode;
        this.shortestPath.push(currentNode);
        while (temp.info?.fromNode) {
          this.shortestPath.push(temp.info.fromNode);
          temp = temp.info.fromNode;
        }

        return;
      }

      this.removeFromArray(this.openNodes, currentNode);
      this.closeNodes.push(currentNode);

      this.findNeighbors(currentNode);

      const length = currentNode.info?.neighbors.length ?? 0;
      for (let i = 0; i < length; i++) {
        let neighbor = currentNode.info?.neighbors[i] ?? new Node(0, 0, false, false);

        if (!this.closeNodes.includes(neighbor)) {
          let tempG = currentNode.info?.distance ?? 0;
          if (currentNode.row !== neighbor.row && currentNode.column !== neighbor.column) {
            tempG += Math.sqrt(800);
          }
          else {
            tempG += 20;
          }

          if (this.openNodes.includes(neighbor)) {
            let neighborG = neighbor.info?.distance ?? 0;
            // if (tempG < neighborG) {
            //   if (neighbor.info) {
            //     neighbor.info.distance = tempG;
            //   }
            // }
          }
          else {
            this.openNodes.push(neighbor);
            neighbor.info = new Info(tempG, 0, 0);
          }

          if (neighbor.info) {
            neighbor.info.distanceToFinish = this.heuristic(neighbor, this.endNode);
            neighbor.info.sumDistance = neighbor.info.distance + neighbor.info.distanceToFinish;
            neighbor.info.fromNode = currentNode;
            console.log(neighbor.info.distance)
            console.log(neighbor.info.distanceToFinish)
            console.log(neighbor.info.sumDistance)
          }
        }
      }
    }
  }
  heuristic(neighbor: Node, endNode: Node): number {
    return Math.sqrt(Math.pow((this.endNode.row - neighbor.row), 2) + Math.pow((this.endNode.column - neighbor.column), 2)) * 10;
  }

  findNeighbors(node: Node): void {
    let x = node.row;
    let y = node.column;

    if (!node.info) {
      node.info = new Info(0, 0, 0);
    }

    if (node.info) {
      if (x > 0 && y > 0) {
        node.info.neighbors.push(this.nodes[x - 1][y - 1]);
      }
      if (x < this.nodes.length - 1 && y < this.nodes[0].length - 1) {
        node.info.neighbors.push(this.nodes[x + 1][y + 1]);
      }
      if (x < this.nodes.length - 1 && y > 0) {
        node.info.neighbors.push(this.nodes[x + 1][y - 1]);
      }
      if (x > 0 && y < this.nodes[0].length - 1) {
        node.info.neighbors.push(this.nodes[x - 1][y + 1]);
      }
      if (x < this.nodes.length - 1) {
        node.info.neighbors.push(this.nodes[x + 1][y]);
      }
      if (y < this.nodes[0].length - 1) {
        node.info.neighbors.push(this.nodes[x][y + 1]);
      }
      if (y > 0) {
        node.info.neighbors.push(this.nodes[x][y - 1]);
      }
      if (x > 0) {
        node.info.neighbors.push(this.nodes[x - 1][y]);
      }
    }
  }

  findNodeWithLowestSum() {
    let lowestSum = this.openNodes[0].info?.sumDistance ?? 0;
    let nodeIndex = 0;
    for (let i = 1; i < this.openNodes.length; i++) {
      const currentSum = this.openNodes[i].info?.sumDistance ?? 0;
      if (currentSum < lowestSum) {
        lowestSum = currentSum;
        nodeIndex = i;
      }
    }

    return this.openNodes[nodeIndex];
  }

  removeFromArray(array: Node[], element: Node) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === element) {
        array.splice(i, 1);
      }
    }
  }
}
