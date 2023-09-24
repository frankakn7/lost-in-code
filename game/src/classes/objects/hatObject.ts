import {HatMap} from "../../constants/hatMap";
import RoomScene from "../room";
import InteractiveObject from "./interactiveObject";
import {gameController} from "../../main";


export default class HatObject extends InteractiveObject {
    protected _hatId = "sorcerersHat";

    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(scene, room, x, y, params, properties);
        this.body.enable = false;
        this.body.setOffset(0, 0);


        properties.forEach(p => {
            if (p["name"] == "hat_id") {
                this._hatId = p["value"];
            }
        });

        if (this._hatId in HatMap)
            this.setTexture(HatMap[this._hatId].texture);

        this.scene.events.on("hats_unlock_check", this.checkIfUnlocked, this);
        this.setDepth(3);
        this.checkIfUnlocked();
    }

    public interact(): void {
        // this.room.worldViewScene.hatView.unlock(this._hatId);
        gameController.hatManager.unlock(this._hatId);
        this.destroy();
    }

    public checkIfUnlocked() {
        // if (this.room.getPlayView().user.unlockedHats.includes(this._hatId)
        // ||  this.room.getPlayView().user.unlockedHats.includes(this._hatId)) {
        // console.log("CHECKING HATS UNLOCKED")
        // console.log(this.room.worldViewScene.user)
        if (gameController.gameStateManager.user.unlockedHats.includes(this._hatId)) {
            this.destroy();
        }
    }
}