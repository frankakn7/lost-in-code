import { text } from "express";
import { BodyType, Vector } from "matter";
import WorldViewScene from "../scenes/worldViewScene";
import { gameController } from "../main";
import { HatMap } from "../constants/hatMap";
import StaticBody = Phaser.Physics.Arcade.StaticBody;
import { globalEventBus } from "../helpers/globalEventBus";
import { GameEvents } from "../types/gameEvents";
import PointsMessage from "../ui/pointsMessage";

/**
 * The Player class. This represents the player on the map and contains all the logic for movement, animations etc.
 */
// export class Player extends Phaser.Physics.Arcade.Sprite {
export class Player extends Phaser.GameObjects.Container {
    private _config = {
        movementSpeed: 150,
        breathSpeed: 300,
        breathScope: 30,
        wobbleSpeed: 40,
        wobbleScope: 10,
    };

    private _breathCalcHelperVar = 0; // Helper variable for the breathing animation
    private _walkingRotationHelperVar = 0; // Helper variable for the walking animation

    private _isMoving = false; // Is the player currently moving?

    private pointsMessagesQueue: number[] = [];
    private isMessageBeingDisplayed: boolean = false;
    // private currentDisplayedMessage: PointsMessage = null;

    private _playerFeetOffset = -3;
    private _hatYOffset = -16; // The offset of the hat from the player

    private _keys; // The keyboard keys for movement

    private _playerSprite: Phaser.GameObjects.Sprite;
    private _shadowSprite: Phaser.GameObjects.Sprite;

    // private _pointsMessage: Phaser.GameObjects.Text;

    body: Phaser.Physics.Arcade.Body;

    /**
     * The constructor of the player class
     * @param scene  The scene the player is in
     * @param x  The x position of the player
     * @param y  The y position of the player
     * @param texture  The texture of the player
     */
    constructor(scene, x, y, texture) {
        // Basic scene setup
        super(scene, x, y);

        this.scene.physics.world.enable(this);

        this.body.setCollideWorldBounds(true);
        this.body.setSize(16, 10);
        this.setDepth(4);

        this._playerSprite = this.scene.add.sprite(
            this.body.width / 2,
            this.body.height + this._playerFeetOffset,
            texture,
        );
        this._shadowSprite = this.scene.add.sprite(this.body.width / 2, this.body.height, "shadowTexture");

        this.add(this._shadowSprite);
        this.add(this._playerSprite);

        // this.addPointsMessage(5);

        // Animation and graphics setup
        this._playerSprite.flipX = false;
        this._playerSprite.setOrigin(0.5, 1);
        this._shadowSprite.setOrigin(0.5, 1);

        // Input setup
        this._keys = this.scene.input.keyboard.addKeys(
            {
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
            },
            false,
        );

        const addPointsMessage = this.addPointsMessage.bind(this);
        globalEventBus.on(GameEvents.POINTS_EARNED, (points) => {
            addPointsMessage(points);
        });
    }

    /**
     * The preUpdate function of the player. This is called every frame before the update function.
     * @param time
     * @param delta
     */
    preUpdate(time, delta) {
        // Movement
        this.updateMovement(delta);

        // Animation updates
        this.updateBreathAnimation(delta, this._config.breathSpeed, this._config.breathScope);
        this.updateWalkAnimation(delta, this._config.wobbleSpeed, this._config.wobbleScope);

        // Hat update
        this.updateHat();

        // if (!this.currentDisplayedMessage?.active) {
        //     this.currentDisplayedMessage = null;
        // }
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
            let fac = Math.sin(this._breathCalcHelperVar) / breathScope;

            // Adjust the scaleY (vertical scale) of the object based on the calculated factor fac.
            // The object will oscillate between 1 - breathScope and 1 + breathScope.
            this._playerSprite.scaleY = 1 + fac;

            // Set the origin of the object to (0.5, 1).
            // This will make the object scale from the bottom center during breathing.
        } else {
            // If the object is moving, reset the scale to 1 to maintain its original size.
            this._playerSprite.scale = 1;
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
            this._playerSprite.angle = rot_fac;
        } else {
            // If the object is not moving, reset the angle to 0 to keep it upright.
            this._playerSprite.angle = 0;
        }

        // Flipping the object and its shadow based on the direction of movement.
        if (this.body.velocity.x < 0) {
            // If the object is moving to the left (negative velocity in the x-direction), flip it horizontally.
            this._playerSprite.flipX = true;
            // this._shadowSprite.flipX = true;
        } else if (this.body.velocity.x > 0) {
            // If the object is moving to the right (positive velocity in the x-direction), reset flipping.
            this._playerSprite.flipX = false;
            // this._shadowSprite.flipX = false;
        }
    }

    private updateMovement(delta: number) {
        let deltaDevided = delta / 1000;
        // Create a new object 'new_velocity' to store the updated x and y velocities of the player.
        let new_velocity = { x: 0, y: 0 };

        // Check if the 'up' or 'down' keys are pressed or any custom 'upPress' or 'downPress' flags are set.
        if (
            this._keys.up.isDown ||
            this._keys.down.isDown ||
            gameController.buttonStates.upPress ||
            gameController.buttonStates.downPress
        ) {
            if (this._keys.up.isDown || gameController.buttonStates.upPress)
                new_velocity.y -= this._config.movementSpeed; //* delta;
            if (this._keys.down.isDown || gameController.buttonStates.downPress)
                new_velocity.y += this._config.movementSpeed; //* delta;
        } else if (
            this._keys.left.isDown ||
            this._keys.right.isDown ||
            gameController.buttonStates.rightPress ||
            gameController.buttonStates.leftPress
        ) {
            if (this._keys.left.isDown || gameController.buttonStates.leftPress)
                new_velocity.x -= this._config.movementSpeed; //* delta;
            if (this._keys.right.isDown || gameController.buttonStates.rightPress)
                new_velocity.x += this._config.movementSpeed; //* delta;
        }

        // Set the players velocity
        this.body.setVelocityY(new_velocity.y);
        this.body.setVelocityX(new_velocity.x);

        if (new_velocity.x != 0 || new_velocity.y != 0) {
            this._isMoving = true;
        } else {
            this._isMoving = false;
        }
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

            let renderTexture = this.scene.make.renderTexture({ width, height }, false);
            renderTexture.draw("playerTexture", 0, 32);
            renderTexture.draw(HatMap[hatId].texture, 0, 32 + this._hatYOffset);

            // Define a texture key for the player's texture with the selected hat.
            // If this texture key does not already exist, save the render texture as a new texture.
            let textureKey = "playerTextureWith" + hatId;
            if (!this.scene.textures.exists(textureKey)) {
                renderTexture.saveTexture(textureKey);
            }

            // Set the player's texture to the newly created texture with the selected hat.
            this._playerSprite.setTexture(textureKey);
        } else {
            this._playerSprite.setTexture("playerTexture");
        }
    }

    addPointsMessage(points) {
        // Add the points message to the queue
        this.pointsMessagesQueue.push(points);
        console.log(this.pointsMessagesQueue);

        // Try to display the next message if none is currently being displayed
        if (!this.isMessageBeingDisplayed) {
            this.displayNextPointsMessage();
        }
    }

    displayNextPointsMessage() {
        if (this.pointsMessagesQueue.length > 0) {
            const points = this.pointsMessagesQueue.shift(); // Remove the first element from the queue
            let message = new PointsMessage(
                this.scene,
                this._playerSprite.width / 4,
                -this._playerSprite.height,
                points,
            );
            this.scene.add.existing(message);
            this.add(message);
            // this.currentDisplayedMessage = message;
            this.isMessageBeingDisplayed = true;
            console.log(message);
            setTimeout(() => {
                this.isMessageBeingDisplayed = false;
                if (this.pointsMessagesQueue.length > 0) {
                    this.displayNextPointsMessage(); // Display the next message, if any
                }
            }, 500); // Assuming 'lifespan' is in milliseconds, adjust the delay here
        }
    }

    // private updatePointsMessage() {
    //     if (this._frames > 0 && this._pointsMessage) {
    //         this._frames--;
    //         this._pointsMessage.y -= 0.1;
    //     } else if (this._frames <= 0) {
    //         this._frames = 60;
    //         this._pointsMessage.destroy(false);
    //         this._pointsMessage = null;
    //     }
    // }
}
