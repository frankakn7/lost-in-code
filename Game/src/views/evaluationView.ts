import * as Phaser from "phaser";


export default class EvaluationView extends Phaser.Scene {
    private _tilesprite;
    private _rootNode;

    constructor(rootNode) {
        super("EvaluationView");
        this._rootNode = rootNode;
    }

    public create() {
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);
    }
}