import * as Phaser from "phaser";
import {HatMap} from "../constants/hatMap";
import DeviceButton from "../ui/deviceButton";
import {formatTime, globalEventBus} from "../helpers/globalEventBus";
import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";
import {GameEvents} from "../types/gameEvents";


export default class EvaluationViewScene extends Phaser.Scene {
    private _tilesprite;
    private _defaultLabelStyle;
    private _xOffset = 60;

    constructor() {
        super(SceneKeys.EVALUATION_VIEW_SCENE_KEY);
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

        let evaluationString = "- Tasks correctly solved: " + gameController.acheivementManager.tasksCounter
            + "\n" + "- Longest streak: " + gameController.acheivementManager.longestStreak
            + "\n" + "- Mistakes made: " + gameController.acheivementManager.incorrectCounter
            + "\n" + "- Fastest solving time: " + formatTime(gameController.acheivementManager.fastestTaskTime)
            + "\n" + "- Badges earned: " + gameController.acheivementManager.badgesEarned
            + "\n" + "- Hats found: " + gameController.gameStateManager.user.unlockedHats.filter((value, index, self) => self.indexOf(value) === index) + " out of " + Object.keys(HatMap).length

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
                        globalEventBus.emit(GameEvents.BROADCAST_NEWS, "Copied to clipboard")
                    }, () => {
                        globalEventBus.emit(GameEvents.BROADCAST_NEWS, "Could not copy to clipboard")
                    });
            }),
            "Copy to Clipboard"
        )
        this.add.existing(shareButton);
    }

    // private _backToMenu() {
    //     this._worldViewScene.menuView.scene.resume();
    //     this.scene.sleep();
    // }

}