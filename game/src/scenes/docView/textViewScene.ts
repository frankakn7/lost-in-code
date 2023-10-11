import Phaser from "phaser";
import ChatTextContainer from "../../ui/chatTextContainer";
import DocViewScene from "./docViewScene";
import SpriteButton from "../../ui/SpriteButton";
import {SceneKeys} from "../../types/sceneKeys";
import {gameController} from "../../main";
import ChapterTextContainer from "../../ui/chapterTextContainer";

export default class TextViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private _chatTextContainer: ChapterTextContainer;

    private _textToDisplay;

    private _textObjectToDisplay: Phaser.GameObjects.Text;

    private _resumeButton;

    private _textStyle;

    constructor(textToDisplay) {
        super(SceneKeys.TEXT_VIEW_SCENE_KEY);
        this._textToDisplay = textToDisplay;
    }

    public create() {
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
        this._resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {
                gameController.menuSceneController.backToDocViewScene();
            }
        ).setDepth(2);
        this.add.existing(this._resumeButton);

        // this._chatTextContainer = new ChatTextContainer(this, 0, this._resumeButton.y + this._resumeButton.height);
        this._chatTextContainer = new ChapterTextContainer(this, 0, this._resumeButton.y + this._resumeButton.height);
        // this._chatTextContainer.addFullRecievedText(this._textToDisplay);
        this._chatTextContainer.addFullDocText(this._textToDisplay)
        // this.chatTextContainer.addAnswerText(this.textToDisplay);
    }
}