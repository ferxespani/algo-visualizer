import { Node } from "./node.model";

export class Info {
    public fromNode: Node | undefined;
    public distance: number;
    public distanceToFinish: number;
    public sumDistance: number;
    public neighbors: Node[];

    constructor(distance: number, distanceToFinish: number, sumDistance: number) {
        this.distance = distance;
        this.distanceToFinish = distanceToFinish;
        this.sumDistance = sumDistance;
        this.neighbors = new Array<Node>();
    }
}