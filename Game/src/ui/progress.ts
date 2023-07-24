import * as Phaser from "phaser";
import RootNode from "../views/rootNode";
import {globalEventBus} from "../helpers/globalEventBus";

export default class ProgressBar extends Phaser.Scene {
    private _bar;
    private _rootNode;

    constructor(rootNode: RootNode) {
        super("Progress Bar");
        this._rootNode = rootNode;
    }

    //
    create() {
        this._bar = this.add.graphics();
        this.reset();

        globalEventBus.on("object_repaired", this.updateBar.bind(this));
        globalEventBus.on("room_entered", (() => {
            this.reset()
            this.updateBar()
        }).bind(this));
    }

    public updateBar() {
        const progress = this._rootNode.getCurrentRoom().getFinishedTaskObjectsCount() / this._rootNode.getCurrentRoom().getTaskObjectCount();
        console.log(progress)
        const totalWidthInner = this.cameras.main.displayWidth - 100 - 10;
        this._bar.fillStyle(0xFCFBF4, 1);
        this._bar.fillRect(55, 55, progress * totalWidthInner, 40);
    }

    public reset() {
        const totalWidth = this.cameras.main.displayWidth - 100;
        this._bar.clear();
        this._bar.fillStyle(0x1c1d21, 1);
        this._bar.fillRect(50, 50, totalWidth, 50);
        this._bar.lineStyle(3,0x00c8ff);
        this._bar.strokeRect(50, 50, totalWidth, 50);
    }
}