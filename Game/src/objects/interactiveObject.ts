import * as Phaser from "phaser";

/**
 * A class used to define interactive objects
 */
export default class interactiveObject extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
    }

    /**
     * Function to be executed when player interacts with object
     */
    public interact(){
        //TODO: Build general interactivity function
        console.log("Interacted with "+this);
    }
}
