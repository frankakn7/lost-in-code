import * as Phaser from "phaser";
import SpriteButton from "../ui/SpriteButton";
import ReturnButtonTexture from "../assets/ui/Return-Button.png";
import AchievementManager from "../managers/achievementManager";
import RootNode from "./rootNode";
import {HatMap} from "../constants/hats";
import DeviceButton from "../ui/deviceButton";
import {formatTime, globalEventBus} from "../helpers/globalEventBus";
import {game} from "../main";


export default class EvaluationView extends Phaser.Scene {
    private _tilesprite;
    private _rootNode;
    private _defaultLabelStyle;
    private _xOffset = 60;
    private _am : AchievementManager;

    constructor(rootNode: RootNode, achievementManager: AchievementManager) {
        super("EvaluationView");
        this._rootNode = rootNode;
        this._am = achievementManager;
    }

    preload() {
        this.load.image("returnButtonTexture", ReturnButtonTexture);
    }


    public create() {
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);

        // const resumeButton = new SpriteButton(
        //     this,
        //     "returnButtonTexture",
        //     180,
        //     180,
        //     () => {this._backToMenu()}
        // );
        // this.add.existing(resumeButton);


        this._defaultLabelStyle = {
            fontSize: "40px",
            color: "#FCFBF4",
            fontFamily: "forwardRegular",
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true,
            },
            // align: "center",
            shadow: {
                color: "#000",
                offsetX: 10,
                offsetY: 10,
                fill: true,
                stroke: true,
                blur: 1
            }
        }

        let h1LabelStyle = {
            fontSize: "50px",
            color: "#FCFBF4",
            fontFamily: "forwardRegular",
            wordWrap: {
                width: 1000,
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

        let evaluationString = "- Tasks correctly solved: " + this._am.tasksCounter
            + "\n" + "- Longest streak: " + this._am.longestStreak
            + "\n" + "- Mistakes made: " + this._am.incorrectCounter
            + "\n" + "- Fastest solving time: " + formatTime(this._am.fastestTaskTime)
            + "\n" + "- Badges earned: " + this._am.badgesEarned
            + "\n" + "- Hats found: " + this._rootNode.user.unlockedHats.length + " out of " + Object.keys(HatMap).length

        let headerLabel = this.add.text(this.cameras.main.displayWidth / 2 - 360, 200,
            "Congratulations!\n You finished the game!", h1LabelStyle);

        let resLabel = this.add.text(this._xOffset, 600,
            evaluationString, this._defaultLabelStyle);

        var clipboardString = "Check out my 'Lost in Code' performance!\n" + evaluationString;

        let shareButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - 200,
            1300,
            400,
            (() => {
                // game.domContainer
                navigator.clipboard.writeText(clipboardString)
                    .then(() => {
                        globalEventBus.emit("broadcast_news", "Copied to clipboard")
                    }, () => {
                        globalEventBus.emit("broadcast_news", "Could not copy to clipboard")
                    });
            }),
            "Copy to Clipboard"
        )
        this.add.existing(shareButton);
    }

    private _backToMenu() {
        this._rootNode.menuView.scene.resume();
        this.scene.sleep();
    }

}