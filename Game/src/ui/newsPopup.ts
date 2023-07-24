import * as Phaser from "phaser";
import {text} from "express";
import RootNode from "../views/rootNode";

/**
 * NewsPopup is a popup that displays a message to the player.
 */
export default class NewsPopup extends Phaser.Scene {
    private _message : string; // The message to display.
    protected defaultLabelStyle: Phaser.Types.GameObjects.Text.TextStyle; // The default style for the label.

    private label; // The label that displays the message.
    private lifespan: number; // The lifespan of the popup in milliseconds.
    private _timeLived: number = 0; // The time the popup has been alive in milliseconds.
    private _rootNode: RootNode; // The root node of the game or application.

    private _fadeOutDur: number = 300; // The duration of the fade out animation in milliseconds.
    private _fadeOutTween;
    private _fading = false; // Whether the popup is currently fading out.

    public width: number; // The width of the popup.
    public height: number; // The height of the popup.
    private _textureKey; // The texture key of the achievement texture.
    private _sprite; // The achievement sprite.
    private _rt; // The render texture.

    /**
     * Creates a new NewsPopup instance.
     * @param rootNode - The RootNode scene instance.
     * @param sceneId - The ID of the scene.
     * @param message - The news message to display in the popup.
     * @param lifespan - The duration in milliseconds for which the popup will be displayed.
     * @param achievementTextureKey - The texture key of an achievement associated with the news (optional).
     */
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

    /**
     * Update function for the NewsPopup class. It is responsible for managing the behavior
     * and lifecycle of the NewsPopup.
     * @param time - The current time.
     * @param delta - The delta time between the current and previous update.
     */
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

    /**
     * Initiates the fade-out animation for the NewsPopup.
     * The NewsPopup starts fading out by gradually reducing its alpha (transparency) to 0 over a specific duration.
     * This function is called when the NewsPopup should start disappearing.
     */
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

    /**
     * Removes the NewsPopup from the scene and cleans up any associated resources.
     * This function is called when the NewsPopup is no longer needed and should be removed.
     * It stops any active fade-out animation and removes the NewsPopup from the scene's display list.
     */
    public kill() {
        if(this._fadeOutTween) this.tweens.remove(this._fadeOutTween);
        this._rootNode.scene.remove(this);
    }


    /**
     * Sets up the NewsPopup and initializes its appearance.
     * It creates a render texture and overlays it on the screen with a semi-transparent black color.
     * The news message is displayed as a text label on top of the render texture.
     * If the news contains a texture key, an image sprite is also displayed below the text label.
     * The render texture, text label, and image sprite are faded in using tweens for a smooth transition.
     */
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