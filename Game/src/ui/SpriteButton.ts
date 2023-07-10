import * as Phaser from "phaser";

export default class SpriteButton extends Phaser.GameObjects.Sprite {
    public isPressed : boolean;

    private _textureString : string;
    private _texture : Phaser.GameObjects.Image;

    private _x : number;
    private _y : number;

    private _height : number;
    private _width : number;
    
    private _onClick : Function;

    constructor(
        scene: Phaser.Scene,

        textureString: string,
        x: number,
        y: number,
        func: Function,
        height: number = 180,
        width: number = 180
    ) {
        super(scene, x, y, textureString);
        this._x = x;
        this._y = y;
        this._textureString = textureString;
        this._height = height;
        this._width = width;
        this._onClick = func;
            
        this.setOrigin(0.5, 0.5)
        this.setInteractive()
        this.on("pointerdown", () => {this._onClick();})
    }

}