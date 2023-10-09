import * as Phaser from "phaser";
import WorldViewScene from "../scenes/worldViewScene";
import { globalEventBus } from "../helpers/globalEventBus";
import {gameController} from "../main";
import {GameEvents} from "../types/gameEvents";

export default class ProgressBarContainer {
    private _bar: Phaser.GameObjects.Graphics; // The progress bar graphics object.
    private _barOutline: Phaser.GameObjects.Graphics; // The progress bar graphics object.
    private _container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        this._container = scene.add.container(0, 0); // Initialize the container
        this.create(scene);
    }

    private drawOutline(){
        const totalWidth = this._container.scene.cameras.main.displayWidth - 100;
        this._barOutline.lineStyle(3, 0x00c8ff);
        this._barOutline.strokeRect(50, 50, totalWidth, 50);
    }

    private create(scene: Phaser.Scene) {
        this._bar = scene.add.graphics();
        this._barOutline = scene.add.graphics();
        this._container.add(this._bar);

        this.drawOutline();
        this.updateBarFilling();

        globalEventBus.on(GameEvents.OBJECT_REPAIRED, this.updateBarFilling.bind(this));
        globalEventBus.on(GameEvents.ROOM_ENTERED, () => {
            this._bar.clear();
            this.updateBarFilling();
        });
    }

    public updateBarFilling() {
        const progress = gameController.gameStateManager.room.finishedTaskObjects.length / gameController.roomSceneController.currentRoomScene.roomManager.getTaskObjectCount();
        const totalWidthInner = this._container.scene.cameras.main.displayWidth - 100 - 10;

        this._bar.fillStyle(0xFCFBF4, 1);
        this._bar.fillRect(55, 55, progress * totalWidthInner, 40);
    }

    // public setPosition(x: number, y: number): void {
    //     this._container.setPosition(x, y);
    // }
}
