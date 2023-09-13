import Phaser from "phaser";
import ChatTextContainer from "../../ui/chatTextContainer";
import DocViewScene from "./docViewScene";
import SpriteButton from "../../ui/SpriteButton";

export default class TextViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private chatTextContainer;

    private textToDisplay;

    private textObjectToDisplay: Phaser.GameObjects.Text;

    private docView: DocViewScene;

    private resumeButton;

    private textStyle;

    constructor(docView: DocViewScene, textToDisplay) {
        super("TextViewScene");
        this.docView = docView;
        this.textToDisplay = textToDisplay;
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
        this.resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {
                this._backToMenu()
            }
        ).setDepth(2);
        this.add.existing(this.resumeButton);

        this.chatTextContainer = new ChatTextContainer(this, 0, this.resumeButton.y + this.resumeButton.height);
        this.chatTextContainer.addFullRecievedText(this.textToDisplay);
        // this.chatTextContainer.addAnswerText(this.textToDisplay);
    }

    private _backToMenu() {
        this.docView.scene.resume();
        this.scene.remove();
    }
}