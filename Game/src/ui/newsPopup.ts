import * as Phaser from "phaser";
import {text} from "express";
import RootNode from "../views/rootNode";

export default class NewsPopup extends Phaser.Scene {
    private _message : string;
    protected defaultLabelStyle: Phaser.Types.GameObjects.Text.TextStyle;
    protected shadowStyle: Phaser.Types.GameObjects.Text.TextStyle;
    private label;
    private lifespan: number;
    private _timeLived: number = 0;
    private _rootNode: RootNode;

    private _fadeOutDur: number = 300;
    private _fadeOutTween;
    private _fading = false;

    public width: number;
    public height: number;
    private _textureKey;
    private _sprite;
    private _rt;

    constructor(rootNode: RootNode, sceneId: string, message, lifespan= 300, achievementTextureKey?: string) {
        super(sceneId);
        this._message = message;
        this.lifespan = lifespan;
        this._rootNode = rootNode;
        this.width = this._rootNode.cameras.main.width;
        this.height = this._rootNode.cameras.main.height;

        this._textureKey = achievementTextureKey;


        this.defaultLabelStyle = {
            fontSize: "50px",
            color: "#FCFBF4",
            fontFamily: "forwardRegular",
            wordWrap: {
                width: this.width,
                useAdvancedWrap: true,
            },
            align: "center",
            shadow: {
                color: "#000",
                offsetX: 10,
                offsetY: 10,
                fill: true,
                stroke: true,
                blur: 1
            }
        }
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this._timeLived += delta;

        if (!this._fading) {
            // The 30 is a safety buffer
            if(this._timeLived > this.lifespan - this._fadeOutDur - 30) {
                this.fadeOut();
            }
        }

        if (this._timeLived > this.lifespan) {
            this.kill();
        }
    }

    public fadeOut() {
        if (this._fading) return;

        this._fadeOutTween = this.tweens.add({
                targets: this.label,
                alpha: 0,
                duration: this._fadeOutDur,
                ease: 'Power2'
            });
        this._fading = true;

        if (this._textureKey) {
            this._fadeOutTween = this.tweens.add({
                targets: this._sprite,
                alpha: 0,
                duration: this._fadeOutDur,
                ease: 'Power2'
            });
        }


            this._fadeOutTween = this.tweens.add({
                targets: this._rt,
                alpha: 0,
                duration: this._fadeOutDur,
                ease: 'Power2'
            });


    }

    public kill() {
        if(this._fadeOutTween) this.tweens.remove(this._fadeOutTween);
        this._rootNode.scene.remove(this);
    }


    public create() {

        this._rt = this.add.renderTexture(this.cameras.main.displayWidth / 2, this.cameras.main.displayHeight / 2, this.cameras.main.displayWidth, this.cameras.main.displayHeight).setOrigin(0.5, 0.5);
        this._rt.fill(0x000, 0.5);

        this.label = this.scene.scene.add.text(
            this.width / 2, 400, this._message, this.defaultLabelStyle
        );
        this.label.setOrigin(0.5, 0);
        this.label.setAlpha(0);

        if (this._textureKey) {
            this._sprite = this.add.image(this.cameras.main.displayWidth / 2, 700, this._textureKey).setScale(10, 10).setOrigin(0.5, 0.5).setAlpha(0);


            this.tweens.add({
                targets: this._sprite,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });

            this.tweens.add({
                targets: this._rt,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        }


        this.tweens.add({
            targets: this.label,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

    }
}