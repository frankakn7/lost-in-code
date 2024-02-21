import Phaser from "phaser";
import ChapterManager, { ChapterType } from "../../managers/chapterManager";
import SpriteButton from "../../ui/SpriteButton";
import DeviceButton from "../../ui/deviceButton";
import { SceneKeys } from "../../types/sceneKeys";
import { gameController } from "../../main";
import { debugHelper } from "../../helpers/debugHelper";

export default class DocViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private resumeButton;

    private allChapterButtons: DeviceButton[] = [];

    private buttonSpacing = 50;

    private textView;

    constructor() {
        super(SceneKeys.DOC_VIEW_SCENE_KEY);
    }

    private deleteAllChapterButtons() {
        this.allChapterButtons.forEach((button: DeviceButton) => {
            button.destroy(true);
        });
        this.allChapterButtons = [];
    }

    private createChapterButtons() {
        let previousY = this.resumeButton.y + this.resumeButton.height;
        debugHelper.logValue("Chapters", gameController.chapterManager.chapters);
        gameController.chapterManager.chapters.forEach((chapter: ChapterType) => {
            const buttonWidth = this.cameras.main.displayWidth * 0.7;
            let newButton = new DeviceButton(
                this,
                this.cameras.main.displayWidth / 2 - buttonWidth / 2,
                previousY + this.buttonSpacing,
                buttonWidth,
                () => {
                    gameController.docSceneController.openTextViewScene(chapter.material);
                },
                chapter.name,
            );
            previousY = newButton.y + newButton.height;
            this.add.existing(newButton);
            this.allChapterButtons.push(newButton);
        });
    }

    public create() {
        gameController.chapterManager.updateChapters();
        this._tilesprite = this.add
            .tileSprite(0, 0, this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile")
            .setOrigin(0, 0)
            .setScale(3);

        this.resumeButton = new SpriteButton(this, "returnButtonTexture", 180, 180, () => {
            this._backToMenu();
        });
        this.add.existing(this.resumeButton);
        this.createChapterButtons();

        this.events.on("resume", this.redrawButtons.bind(this));
        this.events.on("wake", this.redrawButtons.bind(this));
    }

    public redrawButtons() {
        console.log("Redrawing Buttons");

        this.deleteAllChapterButtons();
        this.createChapterButtons();
    }

    private _backToMenu() {
        // this._worldViewScene.menuView.scene.resume();
        // this.scene.sleep();
        gameController.menuSceneController.backToMenuScene();
    }
}
