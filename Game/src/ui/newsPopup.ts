import * as Phaser from "phaser";
import {text} from "express";
import PlayView from "../views/playView";

export default class NewsPopup extends Phaser.Scene {
    private _message : string;
    protected defaultLabelStyle: Phaser.Types.GameObjects.Text.TextStyle;
    protected shadowStyle: Phaser.Types.GameObjects.Text.TextStyle;
    private label;
    private lifespan: number;
    private _timeLived: number = 0;
    private _playView: PlayView;

    private _fadeOutDur: number = 300;
    private _fadeOutTween;
    private _fading = false;

    public width: number;
    public height: number;

    constructor(playView: PlayView, sceneId: string, message, lifespan= 300) {
        super(sceneId);
        this._message = message;
        this.lifespan = lifespan;
        this._playView = playView;
        this.width = this._playView.cameras.main.width;
        this.height = this._playView.cameras.main.height;


        this.defaultLabelStyle = {
            fontSize: "50px",
            color: "#eeeee4",
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
            this.fadeOut();
        }

        if (this._timeLived > this.lifespan) {
            this.kill();
        }
    }

    public fadeOut() {
        if(this._timeLived > this.lifespan - this._fadeOutDur - 30) {
            this._fadeOutTween = this.tweens.add({
                targets: this.label,
                alpha: 0,
                duration: this._fadeOutDur,
                ease: 'Power2'
            });
            this._fading = true;
        }
    }

    public kill() {
        if(this._fadeOutTween) this.tweens.remove(this._fadeOutTween);
        this._playView.scene.remove(this);
    }


    public create() {
        this.label = this.scene.scene.add.text(
            this.width / 2, 400, this._message, this.defaultLabelStyle
        );
        this.label.setOrigin(0.5, 0);
        this.label.setAlpha(0);

        this.tweens.add({
            targets: this.label,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
    }
}