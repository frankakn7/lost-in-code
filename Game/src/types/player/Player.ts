import { PlayerSprite } from "./PlayerSprite";

export class Player extends Phaser.GameObjects.Container {
    private sprite : PlayerSprite;

    constructor(scene, x, y, texture) {
        super(scene, x, y);
        this.scene = scene;

        this.setSize(32, 32);
        this.scene.cameras.main.startFollow(this);
        this.scene.physics.world.enable(this);
        this.sprite = new PlayerSprite(this.scene, 0, 0, texture);
        this.add(this.sprite);
    }

    update(time, delta): void {
        this.sprite.update(time, delta);
        console.log(this.y)
    }
}