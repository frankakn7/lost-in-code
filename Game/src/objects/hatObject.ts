import { HatMap } from "../hats/hats";
import RoomScene from "../rooms/room";
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


        if (this.room.getPlayView().hatView.unlockedHats.includes(this._hatId)) {            
            this.destroy();
        }
    }

    public interact(): void {
        this.room.getPlayView().hatView.unlock(this._hatId);
        this.destroy();
    }
}