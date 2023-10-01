import {text} from "express";
import {Vector} from "matter";
import WorldViewScene from "../../scenes/worldViewScene";
import {gameController} from "../../main";
import {HatMap} from "../../constants/hatMap";

/**
 * The Player class. This represents the player on the map and contains all the logic for movement, animations etc.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
    private _movementSpeed = 10; // Players movement speed in pixels per second
    private _breathCalcHelperVar = 0; // Helper variable for the breathing animation
    private _walkingRotationHelperVar = 0; // Helper variable for the walking animation
    private _isMoving = false; // Is the player currently moving?

    private _shadow: Phaser.GameObjects.Sprite; // The shadow of the player
    private _shadowYOffset = 0; // The offset of the shadow from the player

    private _hatYOffset = -16; // The offset of the hat from the player

    private _keys; // The keyboard keys for movement

    private _canMove = true; // Can the player move?

    /**
     * The constructor of the player class
     * @param scene  The scene the player is in
     * @param x  The x position of the player
     * @param y  The y position of the player
     * @param texture  The texture of the player
     * @param worldViewScene  The root node of the game
     */
    constructor(scene, x, y, texture) {
        // Basic scene setup
        super(scene, x, y, texture);
        this.scene = scene;

        // Shadow setup
        this._shadow = this.scene.physics.add.sprite(x, y + this._shadowYOffset, "shadowTexture");
        this._shadow.setDepth(0);

        // Physics setup
        this.scene.physics.world.enable(this);
        this.setCollideWorldBounds(true);

        // Animation and graphics setup
        this.flipX = false;
        this.scale = 1;
        this.setSize(20, 32);
        this.setDepth(4);


        // Input setup
        this._keys = this.scene.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D
        }, false);

    }

    /**
     * The preUpdate function of the player. This is called every frame before the update function.
     * @param time
     * @param delta
     */
    preUpdate(time, delta) {


        // Movement
        if (this._canMove) {
            this.updateMovement(delta);
        }
        // Shadow update
        this.updateShadow();

        // Animation updates
        this.updateBreathAnimation(delta, 300, 30);
        this.updateWalkAnimation(delta, 40, 10);

        // Hat update
        this.updateHat();
    }

    /**
     * The breathing animation function of the player, gets called every frame.
     * @param delta  The delta time of the frame
     * @param breathSpeed  The speed of the breathing animation
     * @param breathScope  How deep the breathing animation goes
     * @private
     */
    private updateBreathAnimation(delta: number, breathSpeed: number, breathScope: number) {
        // Breathing animation only occurs if the object is not moving.
        if (!this._isMoving) {
            // Increment the helper variable _breathCalcHelperVar with the time delta
            this._breathCalcHelperVar += delta / breathSpeed;

            // Calculate the scaling factor for the breathing animation using sine wave.
            // The factor fac is derived from the sine value of _breathCalcHelperVar divided by breathScope.
            // breathScope determines the amplitude of the breathing animation.
            let fac = (Math.sin(this._breathCalcHelperVar) / breathScope);

            // Adjust the scaleY (vertical scale) of the object based on the calculated factor fac.
            // The object will oscillate between 1 - breathScope and 1 + breathScope.
            this.scaleY = 1 + fac;

            // Set the origin of the object to (0.5, 1).
            // This will make the object scale from the bottom center during breathing.
            this.setOrigin(0.5, 1);
        } else {
            // If the object is moving, reset the scale to 1 to maintain its original size.
            this.scale = 1;
        }
    }

    /**
     * The walking animation function of the player, gets called every frame.
     * @param delta
     * @param wobbleSpeed
     * @param wobbleScope
     * @private
     */
    private updateWalkAnimation(delta: number, wobbleSpeed: number, wobbleScope: number) {
        // Walk animation occurs only when the object is moving.
        if (this._isMoving) {
            // Increment the helper variable _walkingRotationHelperVar with the time delta.
            this._walkingRotationHelperVar += delta / wobbleSpeed;

            // Calculate the rotation factor (rot_fac) for the wobbling animation using sine wave.
            // The factor is derived from the sine value of _walkingRotationHelperVar multiplied by wobbleScope.
            // wobbleScope determines the amplitude of the wobbling animation during walking.
            let rot_fac = Math.sin(this._walkingRotationHelperVar) * wobbleScope;

            // Set the angle of the object to the calculated rotation factor rot_fac.
            this.angle = rot_fac;
        } else {
            // If the object is not moving, reset the angle to 0 to keep it upright.
            this.angle = 0;
        }

        // Flipping the object and its shadow based on the direction of movement.
        if (this.body.velocity.x < 0) {
            // If the object is moving to the left (negative velocity in the x-direction), flip it horizontally.
            this.flipX = true;
            this._shadow.flipX = true;
        } else if (this.body.velocity.x > 0) {
            // If the object is moving to the right (positive velocity in the x-direction), reset flipping.
            this.flipX = false;
            this._shadow.flipX = false;
        }
    }

    /**
     * The shadow update function of the player, gets called every frame.
     * @private
     */
    private updateShadow() {
        this._shadow.body.velocity.x = this.body.velocity.x;
        this._shadow.body.velocity.y = this.body.velocity.y;

        // Set the shadow's y position to the main sprite's y position plus the shadowYOffset.
        // This will adjust the shadow's vertical position relative to the main sprite.
        this._shadow.setY(this.y + this._shadowYOffset);

        // Set the shadow's x position to match the main sprite's x position.
        // This will keep the shadow horizontally aligned with the main sprite.
        this._shadow.setX(this.x);
    }

    private updateMovement(delta: number) {
        // Create a new object 'new_velocity' to store the updated x and y velocities of the player.
        let new_velocity = {x: 0, y: 0};

        // Check if the 'up' or 'down' keys are pressed or any custom 'upPress' or 'downPress' flags are set.
        if (this._keys.up.isDown || this._keys.down.isDown || gameController.buttonStates.upPress || gameController.buttonStates.downPress) {
            if (this._keys.up.isDown || gameController.buttonStates.upPress) new_velocity.y -= this._movementSpeed * delta;
            if (this._keys.down.isDown || gameController.buttonStates.downPress) new_velocity.y += this._movementSpeed * delta;
        } else if (this._keys.left.isDown || this._keys.right.isDown || gameController.buttonStates.rightPress || gameController.buttonStates.leftPress) {
            if (this._keys.left.isDown || gameController.buttonStates.leftPress) new_velocity.x -= this._movementSpeed * delta;
            if (this._keys.right.isDown || gameController.buttonStates.rightPress) new_velocity.x += this._movementSpeed * delta;
        }

        // Set the players velocity
        this.setVelocityY(new_velocity.y);
        this.setVelocityX(new_velocity.x);

        // Check if the player's velocity in either x or y direction is non-zero.
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            // If the player is moving (velocity in x or y direction is non-zero), set the '_isMoving' flag to true.
            this._isMoving = true;
        } else {
            // If the player is not moving (velocity in x and y direction is zero), set the '_isMoving' flag to false.
            this._isMoving = false;
        }

    }


    get isMoving(): boolean {
        return this._isMoving;
    }

    /**
     * Update the player's hat appearance based on the selected hat.
     * If a hat is selected, it will be rendered on top of the player's texture.
     * If no hat is selected ("None"), the player's default appearance will be used.
     */
    public updateHat() {

        const hatId = gameController.gameStateManager.user.selectedHat;

        // Check if a hat is selected (hatId is not "None").
        if (hatId !== "None") {
            // Create a render texture with a specific width and height.
            // Draw the player's texture onto the render texture at position (0, 32).
            // Draw the selected hat's texture on top of the player's texture at position (0, 32 + this.hatYOffset).
            const width = 32;
            const height = 64;
            let renderTexture = this.scene.make.renderTexture({width, height}, false);
            renderTexture.draw("playerTexture", 0, 32);
            renderTexture.draw(HatMap[hatId].texture, 0, 32 + this._hatYOffset);

            // Define a texture key for the player's texture with the selected hat.
            // If this texture key does not already exist, save the render texture as a new texture.
            let textureKey = "playerTextureWith" + hatId;
            if (!this.scene.textures.exists(textureKey))
                renderTexture.saveTexture(textureKey);

            // Set the player's texture to the newly created texture with the selected hat.
            this.setTexture(textureKey);

            // Adjust the player's body size and offset to fit the new texture with the hat.
            // The player's body size becomes (20, 32), and the body offset becomes (6, 30).
            this.body.setSize(20, 32);
            this.body.setOffset(6, 30);
        } else {
            // If no hat is selected, set the player's texture to the default "playerTexture".
            // Reset the player's body size to (20, 32), and the body offset to (6, 0).
            this.setTexture("playerTexture");
            this.body.setSize(20, 32);
            this.body.setOffset(6, 0);
        }
    }

    /**
     * Returns the current movement speed of the player.
     * @param can  The new movement speed of the player.
     */
    public setCanMove(can) {
        this._canMove = can;
    }

}
