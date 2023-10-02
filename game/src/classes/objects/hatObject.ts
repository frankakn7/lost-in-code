import {HatMap} from "../../constants/hatMap";
import RoomScene from "../room";
import InteractiveObject from "./interactiveObject";
import {gameController} from "../../main";


export default class HatObject extends InteractiveObject {
    protected _hatId = "sorcerersHat";

    constructor(
        id: number,
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(id, scene, room, x, y, params);
        console.log("### HAT SCENE")
        console.log(this.scene)
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
        gameController.hatManager.unlock(this._hatId);
        this.destroy();
    }

    public checkIfUnlocked() {
        if (gameController.gameStateManager.user.unlockedHats.includes(this._hatId)) {
            this.destroy();
        }
    }
}