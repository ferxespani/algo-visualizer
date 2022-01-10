export class Node {
    static counter: number = 0;

    public id: number;
    public row: number;
    public column: number;
    public isStart: boolean;
    public isFinish: boolean;
    public isInShortestPath: boolean;
    public isVisited: boolean;
    public isWall: boolean;
    public canBeWall: boolean;
    public name: string;
    public distanceFromStart: number;
    public distanceToFinish: number;
    public totalDistance: number;
    public neighbors: Array<Node>;
    public fromNode: Node | null = null;

    constructor(row: number, column: number, isStart: boolean, isFinish: boolean) {
        Node.counter++;

        this.id = Node.counter;
        this.row = row;
        this.column = column;
        this.isStart = isStart;
        this.isFinish = isFinish;
        this.isInShortestPath = false;
        this.isVisited = false;
        this.isWall = false;
        this.canBeWall = true;
        this.name = `${row + 1}:${column + 1}`;
        this.distanceFromStart = 0;
        this.distanceToFinish = 0;
        this.totalDistance = 0;
        this.neighbors = new Array<Node>();
    }
}
