import Phaser from "phaser";
import ChapterManager, {ChapterType} from "../../managers/chapterManager";
import SpriteButton from "../../ui/SpriteButton";
import ReturnButtonTexture from "../../assets/ui/Return-Button.png";
import WorldViewScene from "../worldViewScene";
import DeviceButton from "../../ui/deviceButton";
import TextViewScene from "./textViewScene";
import {SceneKeys} from "../../types/sceneKeys";
import {gameController} from "../../main";

export default class DocViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private resumeButton;

    private allChapterButtons: DeviceButton[] = [];

    private buttonSpacing = 50;

    private textView;

    constructor() {
        super(SceneKeys.DOC_VIEW_SCENE_KEY);
    }

    private createChapterButtons() {
        let previousY = this.resumeButton.y + this.resumeButton.height;
        gameController.chapterManager.chapters.forEach((chapter: ChapterType) => {
            const buttonWidth = this.cameras.main.displayWidth * 0.7;
            let newButton = new DeviceButton(this, this.cameras.main.displayWidth / 2 - buttonWidth / 2, previousY + this.buttonSpacing, buttonWidth, () => {
                gameController.docSceneController.openTextViewScene(chapter.material)
            }, chapter.name)
            previousY = newButton.y + newButton.height;
            this.add.existing(newButton);
            this.allChapterButtons.push(newButton);
        })
    }

    public preload() {
        this.load.image("returnButtonTexture", ReturnButtonTexture);
    }

    public create() {
        gameController.chapterManager.updateChapters()
        this._tilesprite = this.add
            .tileSprite(
                0,
                0,
                this.cameras.main.displayWidth / 3,
                this.cameras.main.displayHeight / 3,
                "backgroundTile"
            )
            .setOrigin(0, 0)
            .setScale(3);

        this.resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {
                this._backToMenu()
            }
        );
        this.add.existing(this.resumeButton);
        this.createChapterButtons();
    }

    private _backToMenu() {
        // this._worldViewScene.menuView.scene.resume();
        // this.scene.sleep();
        gameController.menuSceneController.backToMenuScene();
    }


}