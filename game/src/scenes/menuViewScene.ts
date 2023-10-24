import * as Phaser from "phaser";

import SpriteButton from "../ui/SpriteButton";

import ApiHelper from "../helpers/apiHelper";

import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";

export default class MenuViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private _settings = {
        columns: 2,
        buttonPadding: 50,
        buttonWidth: 180,
        buttonHeight: 180,
    }

    private apiHelper: ApiHelper = new ApiHelper();

    constructor() {
        super(SceneKeys.MENU_VIEW_SCENE_KEY);
    }

    create() {
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

        const resumeButton = new SpriteButton(
            this,
            "resumeButtonTexture",
            180,
            225,
            () => {
                gameController.worldSceneController.resumeWorldViewScenes();
            },
        );
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

        // Oder was auch immer das dann repräsentieren soll
        const chatButton = new SpriteButton(
            this,
            "antennaAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 1,
            (this.cameras.main.displayHeight / 2) - (this._settings.buttonHeight / 2) - this._settings.buttonPadding,
            () => {
                gameController.chatSceneController.openStoryChatViewWithoutPulling()
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth
        ).setScale(1.25);
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 2,
            (this.cameras.main.displayHeight / 2) - (this._settings.buttonHeight / 2) - this._settings.buttonPadding,
            () => {
                gameController.menuSceneController.openDocViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth
        ).setScale(1.25);
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "hatAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 2,
            (this.cameras.main.displayHeight / 2) + (this._settings.buttonHeight / 2) + this._settings.buttonPadding,
            () => {
                gameController.menuSceneController.openHatViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth
        ).setScale(1.25);
        this.add.existing(hatButton);


        const achievementsButton = new SpriteButton(
            this,
            "achievementsAppTexture",
            (this.cameras.main.displayWidth / (this._settings.columns + 1)) * 1,
            (this.cameras.main.displayHeight / 2) + (this._settings.buttonHeight / 2) + this._settings.buttonPadding,
            () => {
                gameController.menuSceneController.openAcheivementViewScene();
            },
            this._settings.buttonHeight,
            this._settings.buttonWidth
        ).setScale(1.25);
        this.add.existing(achievementsButton);
    }
}
