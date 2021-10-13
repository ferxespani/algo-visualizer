import { Info } from "./info.model";

export class Node {
    public row: number;
    public column: number;
    public isStart: boolean;
    public isFinish: boolean;
    public isInShortestPath: boolean;
    public name: string;
    public info: Info | undefined;

    constructor(row: number, column: number, isStart: boolean, isFinish: boolean) {
        this.row = row;
        this.column = column;
        this.isStart = isStart;
        this.isFinish = isFinish;
        this.isInShortestPath = false;
        this.name = `${row}:${column}`;
        this.info = undefined;
    }
}
