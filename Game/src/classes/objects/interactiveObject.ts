import * as Phaser from "phaser";
import RoomScene from "../room";
import PlayView from "../../views/playView";

/**
 * A class used to define interactive objects
 */
export default class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
    protected room: RoomScene;

    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(scene, x, y, params.texture);
        this.room = room;
        this.setInteractive().on("pointerdown", () => {
            // console.log("Got clicked!!")
            this.interact();
        });
        this.setOrigin(0.0, 0.0);
        this.scene.physics.world.enable(this);
        this.setSize(params.width, params.height);
        this.setImmovable(true);
        this.setDepth(3);
        // TODO Set depth for rendering

        // if (params.origin) this.setOrigin(params.origin.x, params.origin.y);
    }

    /**
     * Function to be executed when player interacts with object
     */
    public interact(){
        //TODO: Build general interactivity function
        console.log("Interacted with "+this);
        this.scene.events.emit("interacted_question_object");
        
    }
}