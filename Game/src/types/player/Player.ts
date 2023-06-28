import { text } from "express";
import ControlPadScene from "../../ui/ControlPadScene";

export class Player extends Phaser.Physics.Arcade.Sprite {
    private movement_speed = 10;
    private breath_calc = 0;
    private walk_rot_calc = 0;
    private is_moving = false;

    private shadow : Phaser.GameObjects.Sprite;
    private shadow_y_offset = 0;

    private keys;

    private controlPad : ControlPadScene;

    public upPress = false
    public downPress = false
    public leftPress = false
    public rightPress = false

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.shadow = this.scene.add.sprite(x, y + this.shadow_y_offset, "shadowTexture");
        
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
        let new_velocity = {x: 0, y: 0};
        if (this.keys.up.isDown || this.keys.down.isDown || this.upPress || this.downPress) {
            if (this.keys.up.isDown || this.upPress) new_velocity.y -= this.movement_speed * delta;
            if (this.keys.down.isDown || this.downPress) new_velocity.y += this.movement_speed * delta;
        }
        else if (this.keys.left.isDown || this.keys.right.isDown || this.rightPress || this.leftPress) {
            if (this.keys.left.isDown || this.leftPress) new_velocity.x -= this.movement_speed * delta;
            if (this.keys.right.isDown || this.rightPress) new_velocity.x += this.movement_speed * delta;
        }
        
        this.setVelocityY(new_velocity.y);
        this.setVelocityX(new_velocity.x);
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) this.is_moving = true;
        else this.is_moving = false;
        // Update shadow pos
        // TODO Turn the shadow to an Arcade.Sprite and set its velocity instead of its position
        this.shadow.setY(this.y + this.shadow_y_offset);
        this.shadow.setX(this.x);

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
        if (this.body.velocity.x < 0) {
            this.flipX = true;
            this.shadow.flipX = true;
        }
        else if (this.body.velocity.x > 0)  {
            this.flipX = false;
            this.shadow.flipX = false;
        }
    }


    public create() {
    }

    public getIsMoving() {
        return this.is_moving;
    }
}