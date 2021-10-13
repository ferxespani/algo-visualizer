import { Component, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";

import { Node } from '../node.model';
import { WaweAlgorithmService } from '../wawe-algorithm.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {
  public nodes: Node[][] = [];

  private draggedNode: any;
  private nodeWidthWithBorder: number = 20;
  private rowsNumber: number = 30;

  screenHeight: number = 0;
  screenWidth: number = 0;

  constructor(private waweAlgorithmService: WaweAlgorithmService) {
      this.getScreenSize();
  }

  ngOnInit(): void {
    this.buildGrid();
  }

  buildGrid() : void {
    if (this.nodes) {
      this.nodes = [];
    }

    const gridWidth = document.querySelector(".grid")?.clientWidth ?? 0;
    const nodesInRow = Math.floor(gridWidth / this.nodeWidthWithBorder);

    if (gridWidth > nodesInRow * this.nodeWidthWithBorder) {
      (document.querySelector(".grid") as HTMLElement).style.width = `${nodesInRow * this.nodeWidthWithBorder}px`;
    }

    for (let i = 0; i < this.rowsNumber; i++) {
      let row = [];

      for (let j = 0; j < nodesInRow; j++) {
        if (i === 10 && j === 15) {
          row.push(new Node(i, j, true, false));
        }
        else if (i === 25 && j === 50) {
          row.push(new Node(i, j, false, true));
        }
        else {
          row.push(new Node(i, j, false, false));
        }
      }

      this.nodes.push(row);
    }
  }

  getNode(x: number, y: number) {
    const column = Math.floor((x - this.screenWidth * 10 / 100) / 20);
    const row = Math.floor(y / 20) - 1;

    return this.nodes[row][column];
  }

  async onClick() {
    this.waweAlgorithmService.initializeGrid(this.nodes);
    this.waweAlgorithmService.start();

    const shortestPath = this.waweAlgorithmService.shortestPath
    for (let i = 0; i < this.nodes.length; i++) {
      let row = this.nodes[i];
      for (let j = 0; j < row.length; j++) {
        for (let k = 0; k < shortestPath.length; k++) {
          if (row[j] === shortestPath[k]) {
            row[j].isInShortestPath = true;
            await new Promise(r => setTimeout(r, 50));
          }
        }
      }
    }
  }

  onDrag(event: any) {

  }

  onDragStart(event: any) {
    this.draggedNode = event.target;

    event.target.style.opacity = 0.2;
  }

  onDragEnd(event: any) {
    event.target.style.opacity = 1;
  }

  onDragEnter(event: any) {
    
  }

  onDragLeave(event: any) {
    
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: any) {
    const node = (this.draggedNode as HTMLElement);
    const target = (event.target as HTMLElement);
    let nodeEl = this.getNode(event.pageX, event.pageY);

    if (node.classList.contains("start")) {
      node.classList.remove("start");
      target.classList.add("start");
      this.nodes[nodeEl.row][nodeEl.column].isStart = true;
    }
    else if (node.classList.contains("finish")) {
      node.classList.remove("finish");
      target.classList.add("finish");
      this.nodes[nodeEl.row][nodeEl.column].isFinish = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;

        this.buildGrid();
  }
}
