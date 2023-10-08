import {Player} from "./Player";

export default class FogOfWar extends  Phaser.GameObjects.RenderTexture {

    private _vision: Phaser.GameObjects.Image;
    private _player: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, player: Player, addToScene: boolean) {
        super(scene, x, y, width, height);

        if(addToScene){
            this.scene.add.existing(this);
        }

        this._player = player;

        // Fill the FOW with a dark blue color (semi-transparent).
        this.fill(0x074e67, 0.8);

        // Create the player's vision as an image representing a circular mask.
        // The mask is positioned above the player's sprite and is twice the size.
        this._vision = this.scene.make.image({
            x: this._player.x,
            y: this._player.y - 16,
            key: "mask",
            add: false,
        });
        this._vision.scale = 2;

        // Apply a BitmapMask to the FOW using the circular vision mask.
        this.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this._vision);
        this.mask.invertAlpha = true;

        // Set a tint for the FOW to give it a darker appearance.
        this.setTint(0x141932);

        // Set the depth of the FOW to ensure it appears above other elements in the scene.
        this.setDepth(10);
    }

    public updatePosition(){
        this._vision.x = this._player.x;
        this._vision.y = this._player.y - 16;
        this.setX(this._player.x);
        this.setY(this._player.y);
    }

}