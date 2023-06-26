import { text } from "express";

export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    private movement_speed = 100;
    private breath_calc = 0
    

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        
        // Physics stuff
        // this.scene.physics.world.enable(this);
        // this.setImmovable(true);
        this.scene.cameras.main.startFollow(this);

        this.flipX = false;
        this.scale = 2;
        
        // this.scene.physics.world.enableBody(this, 0);   
    }

    update(time, delta) {
        this.breath_calc += delta / 100;
        let fac = (Math.sin(this.breath_calc) / 10)
        this.scaleY = 2 + fac
        this.y += Math.cos(this.breath_calc) / 10
        this.setOrigin(1, 1)
        
        console.log(Math.sin(this.breath_calc))
    }


    public create() {
    }
}