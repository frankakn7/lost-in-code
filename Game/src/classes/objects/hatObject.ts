import { HatMap } from "../../constants/hats";
import RoomScene from "../room";
import InteractiveObject from "./interactiveObject";


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
            if (p["name"] == "hat_id")  {
                this._hatId = p["value"];
            }
        });

        if (this._hatId in HatMap)
            this.setTexture(HatMap[this._hatId].texture);

        this.scene.events.on("hats_unlock_check", this.checkIfUnlocked, this);
        this.setDepth(1);
        this.checkIfUnlocked();
    }

    public interact(): void {
        this.room.getPlayView().hatView.unlock(this._hatId);
        this.destroy();
    }

    public checkIfUnlocked() {
        if (this.room.getPlayView().hatView.unlockedHats.includes(this._hatId)
        ||  this.room.getPlayView().getState().hats.unlockedHats.includes(this._hatId)) {            
            this.destroy();
        }
    }
}