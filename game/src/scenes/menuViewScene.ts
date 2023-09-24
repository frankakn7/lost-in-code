import * as Phaser from "phaser";

import SpriteButton from "../ui/SpriteButton";

import ApiHelper from "../helpers/apiHelper";

import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";

export default class MenuViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;

    private _columns = 2;

    private apiHelper: ApiHelper = new ApiHelper();

    constructor() {
        super(SceneKeys.MENU_VIEW_SCENE_KEY);
    }

    preload(){
        console.log("### preloading menu")
    }

    create() {
        console.log("### Creating Menu View")
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
            }
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
            }
        );
        this.add.existing(logoutButton);

        // Oder was auch immer das dann repräsentieren soll
        const chatButton = new SpriteButton(
            this,
            "antennaAppTexture",
            (this.scale.width / (this._columns + 1)) * 1,
            1000,
            () => {
                gameController.chatSceneController.openStoryChatViewWithoutPulling()
            }
        ).setScale(1.25);
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            (this.scale.width / (this._columns + 1)) * 2,
            1000,
            () => {
                gameController.menuSceneController.openDocViewScene();
            }
        ).setScale(1.25);
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "hatAppTexture",
            (this.scale.width / (this._columns + 1)) * 2,
            1300,
            () => {
                gameController.menuSceneController.openHatViewScene();
            }
        ).setScale(1.25);
        this.add.existing(hatButton);


        const achievementsButton = new SpriteButton(
            this,
            "achievementsAppTexture",
            (this.scale.width / (this._columns + 1)) * 1,
            1300,
            () => {
                gameController.menuSceneController.openAcheivementViewScene();
            }
        ).setScale(1.25);
        this.add.existing(achievementsButton);
    }

    // private _resumeGame() {
    //     this.scene.sleep(this);
    //     this._worldViewScene.pauseOrResumeGame(false);
    // }

    // private openSubMenu(menu) {
    //     this.scene.launch(menu);
    //     this.scene.pause();
    // }
}
