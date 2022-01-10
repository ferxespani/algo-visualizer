import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";

import { Node } from '../node.model';
import { WaweAlgorithmService } from '../wawe-algorithm.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit 
{
  public nodes: Node[][] = [];

  private draggedNode: any;
  private nodeWidthWithBorder: number = 20;
  private rowsNumber: number = 30;
  private gridOffsetLeft: number = 0;
  private gridOffsetTop: number = 0;
  private maxNodesInRow: number = 0;

  public startButtonDisabled: boolean = false;
  public resetButtonDisabled: boolean = false;
  public buildWallModeEnabled: boolean = false;

  screenHeight: number = window.innerHeight;
  screenWidth: number = window.innerWidth;

  constructor(private waweAlgorithmService: WaweAlgorithmService) {}

  ngOnInit(): void 
  {
    this.buildGrid();
  }

  buildGrid() : void 
  {
    if (this.nodes) 
    {
      this.nodes = [];
    }

    const grid = document.querySelector(".grid") as HTMLElement;
    const gridWidth = grid?.clientWidth ?? 0;
    this.maxNodesInRow = Math.floor(gridWidth / this.nodeWidthWithBorder);

    this.gridOffsetLeft = grid?.offsetLeft;
    this.gridOffsetTop = grid?.offsetTop;

    if (gridWidth > this.maxNodesInRow * this.nodeWidthWithBorder) 
    {
      (document.querySelector(".grid") as HTMLElement).style.width = `${this.maxNodesInRow * this.nodeWidthWithBorder}px`;
    }

    for (let i = 0; i < this.rowsNumber; i++) 
    {
      let row = [];

      for (let j = 0; j < this.maxNodesInRow; j++) 
      {
        if (i === 10 && j === 15) 
        {
          row.push(new Node(i, j, true, false));
        }
        else if (i === 25 && j === 31) 
        {
          row.push(new Node(i, j, false, true));
        }
        else 
        {
          row.push(new Node(i, j, false, false));
        }
      }

      for (let j = 0; j < row.length; j++) 
      {
        if (row[j].isStart || row[j].isFinish)
        {
          row[j].canBeWall = false;
        }
      }

      this.nodes.push(row);
    }
  }

   getNode(x: number, y: number): Node 
   {
    let column = Math.floor((x - this.screenWidth * 10 / 100) / 20);
    let row = Math.floor((y - this.gridOffsetTop) / 20);

    if (column >= this.maxNodesInRow) 
    {
      column = this.maxNodesInRow - 1;
    }

    if (row >= this.rowsNumber) 
    {
      row = this.rowsNumber - 1;
    }

    return this.nodes[row][column];
  }

  getNodeById(id: number) : Node | null 
  {
    for (let i = 0; i < this.nodes.length; i++) 
    {
      let row = this.nodes[i];

      for (let j = 0; j < row.length; j++) 
      {
        if (this.nodes[i][j].id === id) 
        {
          return this.nodes[i][j];
        }
      }
    }

    return null;
  }

  async onClick()
  {
    this.waweAlgorithmService.initializeGrid(this.nodes);
    this.waweAlgorithmService.start();

    this.startButtonDisabled = true;
    this.resetButtonDisabled = true;

    let uniqueVisitedNodes = [...new Set(this.waweAlgorithmService.visitedNodes)];
    for (let i = 0; i < uniqueVisitedNodes.length; i++) 
    {
      let tempX = uniqueVisitedNodes[i].row;
      let tempY = uniqueVisitedNodes[i].column;
      if (this.nodes[tempX][tempY].isStart || this.nodes[tempX][tempY].isFinish) 
      {
        continue;
      }

      this.nodes[tempX][tempY].isVisited = true;

      await new Promise(r => setTimeout(r, 50));
    }

    const shortestPath = this.waweAlgorithmService.shortestPath
    for (let i = 0; i < shortestPath.length; i++) 
    {
      let tempX = shortestPath[i].row;
      let tempY = shortestPath[i].column;
      if (this.nodes[tempX][tempY].isVisited) 
      {
        this.nodes[tempX][tempY].isVisited = false;
      }

      this.nodes[tempX][tempY].isInShortestPath = true;

      await new Promise(r => setTimeout(r, 50));
    }

    this.resetButtonDisabled = false;
  }

  onReset(): void
  {
    const shortestPath = this.waweAlgorithmService.shortestPath
    for (let i = 0; i < shortestPath.length; i++) 
    {
      let tempX = shortestPath[i].row;
      let tempY = shortestPath[i].column;
      this.nodes[tempX][tempY].isInShortestPath = false;
    }

    let uniqueVisitedNodes = [...new Set(this.waweAlgorithmService.visitedNodes)];
    for (let i = 0; i < uniqueVisitedNodes.length; i++) 
    {
      let tempX = uniqueVisitedNodes[i].row;
      let tempY = uniqueVisitedNodes[i].column;
      this.nodes[tempX][tempY].isVisited = false;
    }

    this.waweAlgorithmService.resetGrid();
    this.startButtonDisabled = false;

    this.buildGrid();
  }

  onBuildWall(): void 
  {
    let buildWallButton = document.querySelector("#wall-btn") as HTMLButtonElement;

    if (buildWallButton.innerText === "Build wall") 
    {
      buildWallButton.innerText = "Finish building";
      buildWallButton.style.color = "black";
      buildWallButton.style.backgroundColor = "white";

      this.buildWallModeEnabled = true; 

      return;
    } 

    buildWallButton.innerText = "Build wall";
    buildWallButton.style.color = "white";
    buildWallButton.style.backgroundColor = "black";

    this.buildWallModeEnabled = false;
  }

  onMakeNodeAWall(event: any) 
  {
    if (this.buildWallModeEnabled) {
      let el = event.target as HTMLElement;
      let node = this.getNodeById(Number(el.getAttribute("data-id")));
      if (node) {
        this.nodes[node.row][node.column].isWall = true;
      }
    }
  }

  onDrag(event: any) {}

  onDragStart(event: any) 
  {
    this.draggedNode = event.target;

    event.target.style.opacity = 0.2;
  }

  onDragEnd(event: any) 
  {
    event.target.style.opacity = 1;
  }

  onDragEnter(event: any) {}

  onDragLeave(event: any) {}

  onDragOver(event: any) 
  {
    event.preventDefault();
  }

  onDrop(event: any) 
  {
    const node = (this.draggedNode as HTMLElement);
    let nodeEl = this.getNode(event.pageX, event.pageY);

    if (node.classList.contains("start")) 
    {
      node.classList.remove("start");
      
      for (let i = 0; i < this.nodes.length; i++) 
      {
        let row = this.nodes[i];

        for (let j = 0; j < row.length; j++) 
        {
          if (this.nodes[i][j].isStart) 
          {
            this.nodes[i][j].isStart = false;
          }
        }
      }

      this.nodes[nodeEl.row][nodeEl.column].isStart = true;
    }
    else if (node.classList.contains("finish")) 
    {
      node.classList.remove("finish");

      for (let i = 0; i < this.nodes.length; i++) 
      {
        let row = this.nodes[i];

        for (let j = 0; j < row.length; j++)
        {
          if (this.nodes[i][j].isFinish) 
          {
            this.nodes[i][j].isFinish = false;
          }
        }
      }

      this.nodes[nodeEl.row][nodeEl.column].isFinish = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) 
  {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        this.buildGrid();
  }
}
