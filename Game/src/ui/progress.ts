import * as Phaser from "phaser";
import PlayView from "../views/playView";
import {globalEventBus} from "../helpers/globalEventBus";

export default class ProgressBar extends Phaser.Scene {
    private _bar;
    private _playView;

    constructor(playView: PlayView) {
        super("Progress Bar");
        this._playView = playView;
    }

    //
    create() {
        this._bar = this.add.graphics();
        this.reset();

        globalEventBus.on("object_repaired", this.updateBar.bind(this));
        globalEventBus.on("room_entered", this.reset.bind(this));
    }

    public updateBar() {
        const progress = this._playView.getCurrentRoom().getFinishedTaskObjectsCount() / this._playView.getCurrentRoom().getTaskObjectCount();
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