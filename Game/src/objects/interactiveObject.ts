import * as Phaser from "phaser";

/**
 * A class used to define interactive objects
 */
export default class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
    ) {
        super(scene, x, y, texture);
        this.setInteractive().on("pointerdown", () => {
            // console.log("Got clicked!!")
            this.interact();
        });
        this.setOrigin(0.5, 0.5);
        this.scene.physics.world.enable(this);
        this.setSize(32, 32);
        this.setImmovable(true);
        this.setDepth(1);
        // TODO Set depth for rendering
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
