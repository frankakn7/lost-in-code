import * as Phaser from "phaser";
import AchievementManager from "../managers/achievementManager";
import ReturnButtonTexture from "../assets/ui/Return-Button.png";
import SpriteButton from "../ui/SpriteButton";
import RootNode from "./rootNode";
import {achievements} from "../constants/achievements";



import TrophyTexture from "../assets/achievements/trophy.png";



export default class AchievementView extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;
    private _manager: AchievementManager;
    private _rootNode: RootNode;

    private _sprites = []
    private _margin = 30;
    private _achievementWidth = 200;
    private _achievementHeight = 200;

    private columns = 3;
    private borderThickness = 20;

    constructor(rootNode, manager) {
        super("AchievementView");
        this._manager = manager;
        this._rootNode = rootNode;
    }

    preload() {
        this.load.image("returnButtonTexture", ReturnButtonTexture);


        this.load.image("trophy", TrophyTexture);
    }

    public create() {
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);

        const resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {this._backToMenu()}
        );
        this.add.existing(resumeButton);


        this.add.image(this.cameras.main.width / 2, 600, "trophy").setOrigin(0.5, 0.5).setScale(13, 13);

        this._drawAchievements();
    }

    private _drawAchievements() {
        let unlocked = this._manager.unlocked;
        let canvasWidth = this.cameras.main.displayWidth;

        let objectsPerRow = Math.floor(canvasWidth / this._achievementWidth);
        let horizontalSPacing = (canvasWidth - (objectsPerRow * this._achievementWidth)) / (objectsPerRow + 1);
        let verticalSpacing = 20;

        let x = horizontalSPacing;
        let y = horizontalSPacing + 830;

        for(let i = 0; i < this._manager.unlocked.length; i++) {




            let rt = this.add.renderTexture(x + this._achievementWidth / 2, y + this._achievementHeight / 2, this._achievementWidth + this.borderThickness, this._achievementHeight + this.borderThickness).setOrigin(0.5, 0.5);
            rt.fill(0x00c8ff);
            let achievement = this.add.image(x, y, achievements[unlocked[i]].texture).setOrigin(0, 0);
            achievement.setScale(10, 10);

            x += this._achievementWidth + horizontalSPacing;

            if (x + this._achievementWidth > canvasWidth) {
                x = horizontalSPacing;
                y += this._achievementWidth + verticalSpacing;
            }
        }
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

    private _backToMenu() {
        this._rootNode.menuView.scene.resume();
        this.scene.sleep();
    }
}
