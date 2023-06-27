import { text } from "express";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private movement_speed = 10;
    private breath_calc = 0;
    private walk_rot_calc = 0;
    private is_moving = false;

    private keys;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        
        
        // Physics stuff
        this.scene.physics.world.enable(this);
        this.setCollideWorldBounds(true);
        // this.setImmovable(true);
        

        this.flipX = false;
        this.scale = 1;
        
        // this.scene.physics.world.enableBody(this, 0);
        this.keys = this.scene.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S,
                                                        'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D});
    }

    preUpdate(time, delta) {
        // Movement
        let new_velocity = {x: 0, y: 0};
        if (this.keys.up.isDown) new_velocity.y -= this.movement_speed * delta;
        if (this.keys.down.isDown) new_velocity.y += this.movement_speed * delta;
        if (this.keys.left.isDown) new_velocity.x -= this.movement_speed * delta;
        if (this.keys.right.isDown) new_velocity.x += this.movement_speed * delta;
        
        this.setVelocityY(new_velocity.y);
        this.setVelocityX(new_velocity.x);
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) this.is_moving = true;
        else this.is_moving = false;

        // Breathing animation
        if (!this.getIsMoving()) {
            this.breath_calc += delta / 100;
            let fac = (Math.sin(this.breath_calc) / 30);
            this.scaleY = 1 + fac;
            this.setOrigin(0.5, 1);
        }
        else this.scale = 1;

        // Walk animation
        if (this.getIsMoving()) {
            this.walk_rot_calc += delta / 40;
            let rot_fac = Math.sin(this.walk_rot_calc) * 6;
            this.angle =+ rot_fac;
        } 
        else this.angle = 0;

        // Flipping stuff
        if (this.body.velocity.x < 0) 
            this.flipX = true;
        else if (this.body.velocity.x > 0) 
            this.flipX = false;
    }


    public create() {
    }

    public getIsMoving() {
        return this.is_moving;
    }
}