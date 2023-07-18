import Phaser from "phaser";
import ChatTextContainer from "../chatView/chatTextContainer";
import DocView from "./docView";
import SpriteButton from "../../ui/SpriteButton";

export default class TextView extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private chatTextContainer;

    private textToDisplay;

    private textObjectToDisplay: Phaser.GameObjects.Text;

    private docView: DocView;

    private resumeButton;

    private textStyle;

    constructor(docView: DocView, textToDisplay) {
        super("TextView");
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

        this.textStyle = {
            fontSize: "30px",
            fontFamily: "forwardRegular",
            color: "#00c8ff",
            wordWrap: {
                width:
                    this.cameras.main.displayWidth -
                    100 * 2,
                useAdvancedWrap: true,
            },
        };

        this.textToDisplay = this.add
            .text(
                this.cameras.main.displayWidth - 100,
                0,
                this.textToDisplay,
                this.textStyle
            )
            .setOrigin(1, 0);

        this.chatTextContainer = new ChatTextContainer(this, 0, this.resumeButton.y + this.resumeButton.height);
        // this.textObjectToDisplay = this.chatTextContainer.addReceivedText()
        // this.textObjectToDisplay.setText(this.textToDisplay);
        this.chatTextContainer.pushAndAdd(this.textToDisplay);
    }

    private _backToMenu() {
        this.docView.scene.resume();
        this.scene.remove();
    }
}