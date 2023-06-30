import { text } from "express";
import ControlPadScene from "../ui/ControlPadScene";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private movementSpeed = 10;
    private _breathCalcHelperVar = 0;
    private _walkingRotationHelperVar = 0;
    private _isMoving = false;

    private shadow : Phaser.GameObjects.Sprite;
    private shadowYOffset = 0;

    private keys;

    private controlPad : ControlPadScene;

    public upPress = false
    public downPress = false
    public leftPress = false
    public rightPress = false

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.shadow = this.scene.add.sprite(x, y + this.shadowYOffset, "shadowTexture");
        
        // Physics stuff
        this.scene.physics.world.enable(this);
        this.setCollideWorldBounds(true);
        // this.setImmovable(true);
        

        this.flipX = false;
        this.scale = 1;
        
        
        // this.scene.physics.world.enableBody(this, 0);
        this.keys = this.scene.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S,
                                                        'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D});
        //this.controlPad = new ControlPadScene();
        // this.scene.scene.add("controlPad", this.controlPad);
        // this.scene.scene.launch(this.controlPad);


    }

    preUpdate(time, delta) {
        // Movement
        
        
        this.updateMovement(delta);
        this.updateShadow();
        this.updateBreathAnimation(delta, 300, 30);
        this.updateWalkAnimation(delta, 40, 10);
        

        
    }

    private updateBreathAnimation(delta: number, breathSpeed: number, breathScope: number) {
        // Breathing animation
        if (!this.getIsMoving()) {
            this._breathCalcHelperVar += delta / breathSpeed;
            let fac = (Math.sin(this._breathCalcHelperVar) / breathScope);
            this.scaleY = 1 + fac;
            this.setOrigin(0.5, 1);
        }
        else this.scale = 1;
    }

    private updateWalkAnimation(delta: number, wobbleSpeed: number, wobbleScope: number) {
        // Walk animation
        if (this.getIsMoving()) {
            this._walkingRotationHelperVar += delta / wobbleSpeed;
            let rot_fac = Math.sin(this._walkingRotationHelperVar) * wobbleScope;
            this.angle =+ rot_fac;
        } 
        else this.angle = 0;

        // Flipping stuff
        if (this.body.velocity.x < 0) {
            this.flipX = true;
            this.shadow.flipX = true;
        }
        else if (this.body.velocity.x > 0)  {
            this.flipX = false;
            this.shadow.flipX = false;
        }
    }

    private updateShadow() {
        // TODO Turn the shadow to an Arcade.Sprite and set its velocity instead of its position
        // (maybe even do an alternative shadow system)
        this.shadow.setY(this.y + this.shadowYOffset);
        this.shadow.setX(this.x);
    }

    private updateMovement(delta: number) {
        let new_velocity = {x: 0, y: 0};
        if (this.keys.up.isDown || this.keys.down.isDown || this.upPress || this.downPress) {
            if (this.keys.up.isDown || this.upPress) new_velocity.y -= this.movementSpeed * delta;
            if (this.keys.down.isDown || this.downPress) new_velocity.y += this.movementSpeed * delta;
        }
        else if (this.keys.left.isDown || this.keys.right.isDown || this.rightPress || this.leftPress) {
            if (this.keys.left.isDown || this.leftPress) new_velocity.x -= this.movementSpeed * delta;
            if (this.keys.right.isDown || this.rightPress) new_velocity.x += this.movementSpeed * delta;
        }
        
        this.setVelocityY(new_velocity.y);
        this.setVelocityX(new_velocity.x);
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) this._isMoving = true;
        else this._isMoving = false;
        
    }

    public create() {
    }

    public getIsMoving() {
        return this._isMoving;
    }
}