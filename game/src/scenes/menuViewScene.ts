import * as Phaser from "phaser";

import SpriteButton from "../ui/SpriteButton";

import ApiHelper from "../helpers/apiHelper";

import { gameController } from "../main";
import { SceneKeys } from "../types/sceneKeys";
import ProgressBarContainer from '../ui/progressBarContainer';
import { roomMap } from '../constants/roomMap';

export default class MenuViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private _settings = {
        columns: 2,
        buttonPadding: 50,
        buttonWidth: 180,
        buttonHeight: 180,
    };

    private roomNameStyle = {
        fontSize: "40px",
        fontFamily: "forwardRegular",
        // color: "#00c8ff",
        color: "white"
    }

    private textStyle = {
        fontSize: "35px",
        fontFamily: "forwardRegular",
        // color: "#00c8ff",
        color: "white"
    }

    private apiHelper: ApiHelper = new ApiHelper();
    private progressBarContainer: ProgressBarContainer;

    private roomName: Phaser.GameObjects.Text;
    private repaired: Phaser.GameObjects.Text;
    private repairedNum: Phaser.GameObjects.Text;
    private points: Phaser.GameObjects.Text;
    private pointsNum: Phaser.GameObjects.Text;

    constructor() {
        super(SceneKeys.MENU_VIEW_SCENE_KEY);
    }

    create() {
        this._tilesprite = this.add
            .tileSprite(0, 0, this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile")
            .setOrigin(0, 0)
            .setScale(3);

        this.progressBarContainer = new ProgressBarContainer(this);

        const resumeButton = new SpriteButton(this, "resumeButtonTexture", 180, 225, () => {
            gameController.worldSceneController.resumeWorldViewScenes();
        });
        this.add.existing(resumeButton);


        const logoutButton = new SpriteButton(
            this,
            "logoutButtonTexture",
            this.cameras.main.displayWidth - 180,
            225,
            () => {
                this.apiHelper.logout().then((response) => {
                    location.reload();
                });
            },
        );
        this.add.existing(logoutButton);


        this.roomName = this.add.text((this.cameras.main.displayWidth) / 2, 210, roomMap.get(gameController.gameStateManager.room.id).roomName, this.roomNameStyle).setOrigin(0.5,0)

        this.repaired = this.add.text((this.cameras.main.displayWidth) / 6, 370, "Repaired Objects: ", this.textStyle).setOrigin(0,0)
        this.repairedNum = this.add.text((this.cameras.main.displayWidth) * 4 / 6, 370, gameController.gameStateManager.room.finishedTaskObjects.length+" / "+roomMap.get(gameController.gameStateManager.room.id).numberOfObjects, this.textStyle).setOrigin(0,0)

        this.points = this.add.text((this.cameras.main.displayWidth) / 6, 370 + this.repaired.height + 30, "Total Points: ", this.textStyle).setOrigin(0,0)
        this.pointsNum = this.add.text((this.cameras.main.displayWidth) * 4 / 6, 370 + this.repaired.height + 30, gameController.gameStateManager.user.points+"", this.textStyle).setOrigin(0,0)

        this.events.on("resume", this.updateText.bind(this));
        this.events.on("wake", this.updateText.bind(this));


        // Oder was auch immer das dann repräsentieren soll
        const chatButton = new SpriteButton(
            this,
            "antennaAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 1,
            this.cameras.main.displayHeight / 2 - this._settings.buttonHeight / 2 - this._settings.buttonPadding,
            () => {
                gameController.chatSceneController.openStoryChatViewWithoutPulling();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth,
        ).setScale(1.25);
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 2,
            this.cameras.main.displayHeight / 2 - this._settings.buttonHeight / 2 - this._settings.buttonPadding,
            () => {
                gameController.menuSceneController.openDocViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth,
        ).setScale(1.25);
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "hatAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 2,
            this.cameras.main.displayHeight / 2 + this._settings.buttonHeight / 2 + this._settings.buttonPadding,
            () => {
                gameController.menuSceneController.openHatViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth,
        ).setScale(1.25);
        this.add.existing(hatButton);

        const achievementsButton = new SpriteButton(
            this,
            "achievementsAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 1,
            this.cameras.main.displayHeight / 2 + this._settings.buttonHeight / 2 + this._settings.buttonPadding,
            () => {
                gameController.menuSceneController.openAcheivementViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth,
        ).setScale(1.25);
        this.add.existing(achievementsButton);

        const leaderboardButton = new SpriteButton(
            this,
            "leaderboardAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 1,
            this.cameras.main.displayHeight / 2 +
                this._settings.buttonHeight / 2 +
                this._settings.buttonPadding * 3 +
                this._settings.buttonHeight,
            () => {
                gameController.menuSceneController.openLeaderboardViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth,
        ).setScale(1.25);
        this.add.existing(leaderboardButton);
    }

    private updateText () {
        this.roomName.setText(roomMap.get(gameController.gameStateManager.room.id).roomName);
        this.repairedNum.setText(gameController.gameStateManager.room.finishedTaskObjects.length+" / "+roomMap.get(gameController.gameStateManager.room.id).numberOfObjects);
        this.pointsNum.setText(gameController.gameStateManager.user.points+"");
    }
}
