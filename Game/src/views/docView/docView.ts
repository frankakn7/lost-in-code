import Phaser from "phaser";
import ChapterManager, {ChapterType} from "../../managers/chapterManager";
import SpriteButton from "../../ui/SpriteButton";
import ReturnButtonTexture from "../../assets/ui/Return-Button.png";
import PlayView from "../playView";
import DeviceButton from "../../ui/deviceButton";
import TextView from "./textView";

export default class DocView extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    public chapterManager: ChapterManager;

    private _playView: PlayView;

    private resumeButton;

    private allChapterButtons: DeviceButton[] = [];

    private buttonSpacing = 50;

    private textView;

    public newChapter;

    constructor(playView: PlayView, chapterNumber: number) {
        super("DocView");
        this.chapterManager = new ChapterManager(chapterNumber)
        this._playView = playView;
    }

    private createChapterButtons() {
        let previousY = this.resumeButton.y + this.resumeButton.height;
        this.chapterManager.getChapters().forEach((chapter: ChapterType) => {
            const buttonWidth = this.cameras.main.displayWidth * 0.7;
            let newButton = new DeviceButton(this, this.cameras.main.displayWidth / 2 - buttonWidth / 2, previousY + this.buttonSpacing, buttonWidth, () => {
                console.log("Open chat view for"+chapter.name)
                this.openTextMenu(chapter.material)
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
        this.chapterManager.updateChapters()
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
        this._playView.menuView.scene.resume();
        this.scene.sleep();
    }

    private openTextMenu(textToShow) {
        this.textView = new TextView(this,textToShow)
        this.scene.add("TextView",this.textView)
        this.scene.launch(this.textView);
        this.scene.pause();
    }
}