import * as Phaser from "phaser";
import RoomScene from "../room";
import WorldViewScene from "../../scenes/worldViewScene";

/**
 * InteractiveObject is a base class for objects that can be interacted with in a RoomScene.
 * It extends Phaser.Physics.Arcade.Sprite and provides common functionality for interactive objects.
 *
 * @class InteractiveObject
 * @extends Phaser.Physics.Arcade.Sprite
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

    }

    /**
     * Function to be executed when player interacts with object
     */
    public interact(){
        console.log("Interacted with "+this);
        this.scene.events.emit("interacted_question_object");
        
    }
}
