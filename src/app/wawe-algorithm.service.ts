import { Injectable } from '@angular/core';

import { Node } from './node.model';

@Injectable({
  providedIn: 'root'
})
export class WaweAlgorithmService 
{

  private nodes: Node[][] = [];
  private startNode: Node = new Node(0, 0, false, false);
  private endNode: Node = new Node(0, 0, false, false);
  private openNodes: Node[] = [];
  private closeNodes: Node[] = [];
  public shortestPath: Node[] = [];
  public visitedNodes: Node[] = [];

  constructor() {}

  initializeGrid(nodes: Node[][]): void 
  {
    this.nodes = nodes;

    this.searchStartNode();
    this.searchEndNode();
  }

  resetGrid(): void 
  {
    this.nodes = [];
    this.openNodes = [];
    this.closeNodes = [];
    this.shortestPath = [];
    this.visitedNodes = [];
    this.startNode = new Node(0, 0, false, false);
    this.endNode = new Node(0, 0, false, false);
  }

  searchStartNode(): void 
  {
    for (let i = 0; i < this.nodes.length; i++) 
    {
      let row = this.nodes[i];

      for (let j = 0; j < row.length; j++) 
      {
        if (this.nodes[i][j].isStart) 
        {
          this.startNode = this.nodes[i][j];
        }
      }
    }
  }

  searchEndNode(): void 
  {
    for (let i = 0; i < this.nodes.length; i++) 
    {
      let row = this.nodes[i];

      for (let j = 0; j < row.length; j++) 
      {
        if (this.nodes[i][j].isFinish) 
        {
          this.endNode = this.nodes[i][j];
        }
      }
    }
  }

  start(): void 
  {
    this.openNodes.push(this.startNode)

    while (this.openNodes.length !== 0) 
    {
      let currentNode = this.findNodeWithLowestSum();

      if (currentNode.row === this.endNode.row && currentNode.column === this.endNode.column) 
      {
        console.log("DONE!!!");

        let temp = currentNode;
        this.shortestPath.unshift(currentNode);
        while (temp.fromNode) 
        {
          this.shortestPath.unshift(temp.fromNode);
          Array.prototype.unshift.apply(this.visitedNodes, temp.neighbors);
          temp = temp.fromNode;

          if (!temp.fromNode) 
          {
            Array.prototype.unshift.apply(this.visitedNodes, temp.neighbors);
          }
        }

        return;
      }

      this.removeFromArray(this.openNodes, currentNode);
      this.closeNodes.push(currentNode);

      this.findNeighbors(currentNode);

      const neighborsNumber = currentNode.neighbors.length;
      for (let i = 0; i < neighborsNumber; i++) 
      {
        let neighbor = currentNode.neighbors[i];

        if (!this.closeNodes.includes(neighbor)) 
        {
          let tempG = currentNode.distanceFromStart;
          if (currentNode.row !== neighbor.row && currentNode.column !== neighbor.column) 
          {
            tempG += Math.sqrt(800);
          }
          else 
          {
            tempG += 20;
          }

          var newPath = false;
          if (this.openNodes.includes(neighbor)) 
          {
            let neighborG = neighbor.distanceFromStart;
            if (tempG < neighborG) 
            {
              newPath = true;
              neighbor.distanceFromStart = tempG;
            }
          }
          else 
          {
            newPath = true;
            this.openNodes.push(neighbor);
            neighbor.distanceFromStart = tempG;
          }

          if (newPath) 
          {
            neighbor.distanceToFinish = this.heuristic(neighbor, this.endNode);
            neighbor.totalDistance = neighbor.distanceFromStart + neighbor.distanceToFinish;
            neighbor.fromNode = currentNode;
          }
        }
      }
    }
  }

  heuristic(neighbor: Node, endNode: Node): number 
  {
    return Math.max(Math.abs(endNode.row - neighbor.row), Math.abs(endNode.column - neighbor.column));
  }

  findNeighbors(node: Node): void 
  {
    let x = node.row;
    let y = node.column;

    if (x > 0 && y > 0) 
    {
      let neighborNode = this.nodes[x - 1][y - 1];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (x < this.nodes.length - 1 && y < this.nodes[0].length - 1) 
    {
      let neighborNode = this.nodes[x + 1][y + 1];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (x < this.nodes.length - 1 && y > 0) 
    {
      let neighborNode = this.nodes[x + 1][y - 1];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (x > 0 && y < this.nodes[0].length - 1) 
    {
      let neighborNode = this.nodes[x - 1][y + 1];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (x < this.nodes.length - 1) 
    {
      let neighborNode = this.nodes[x + 1][y];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (y < this.nodes[0].length - 1) 
    {
      let neighborNode = this.nodes[x][y + 1];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (y > 0) 
    {
      let neighborNode = this.nodes[x][y - 1];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }

    if (x > 0) 
    {
      let neighborNode = this.nodes[x - 1][y];

      if (!neighborNode.isWall)
        node.neighbors.push(neighborNode);
    }
  }

  findNodeWithLowestSum(): Node 
  {
    let lowestSum = this.openNodes[0].totalDistance;
    let nodeIndex = 0;
    for (let i = 0; i < this.openNodes.length; i++) 
    {
      const currentSum = this.openNodes[i].totalDistance;
      if (currentSum < lowestSum) 
      {
        lowestSum = currentSum;
        nodeIndex = i;
      }
    }

    return this.openNodes[nodeIndex];
  }

  removeFromArray(array: Node[], element: Node): void
  {
    for (let i = 0; i < array.length; i++) 
    {
      if (array[i] === element) 
      {
        array.splice(i, 1);
      }
    }
  }
}
