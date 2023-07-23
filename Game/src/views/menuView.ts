import * as Phaser from "phaser";
import DeviceButton from "../ui/deviceButton";
import SpriteButton from "../ui/SpriteButton";
import RootNode from "./rootNode";

import AntennaAppTexture from "../assets/ui/apps/Antenna-app-icon.png";
import ResumeButtonTexture from "../assets/ui/Resume-Button.png";
import SettingsButtonTexture from "../assets/ui/apps/Settings-app-icon.png";
import KnowledgeButtonTexture from "../assets/ui/apps/knowledge-app-icon.png";
import HatAppTexture from "../assets/ui/apps/Hat-app-icon.png";
import LogoutButtonTexture from "../assets/ui/Logout-Button.png";
import HatView from "./hatView";
import ApiHelper from "../helpers/apiHelper";

import AchievementsAppTexture from "../assets/ui/apps/Achievements-app-icon.png";
import AchievementManager from "../managers/achievementManager";
import AchievementView from "./achievementView";
import EvaluationView from "./evaluationView";

export default class MenuView extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;
    private _rootNode: RootNode;

    private hatView: HatView;

    private _columns = 2;

    private apiHelper: ApiHelper = new ApiHelper();

    private _achievementView : AchievementView;

    public preload() {
        this.load.image("antennaAppTexture", AntennaAppTexture);
        this.load.image("knowledgeAppTexture", KnowledgeButtonTexture);
        this.load.image("settingsAppTexture", SettingsButtonTexture);
        this.load.image("resumeButtonTexture", ResumeButtonTexture);
        this.load.image("logoutButtonTexture", LogoutButtonTexture);
        this.load.image("achievementsAppTexture", AchievementsAppTexture);
        this.load.image("hatAppTexture", HatAppTexture);
    }

    constructor(
        rootNode: RootNode,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super(settingsConfig);
        this._rootNode = rootNode;
        // this.hatView = new HatView();
        this._achievementView = new AchievementView(this._rootNode, this._rootNode.achievementManager);
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

        const resumeButton = new SpriteButton(
            this,
            "resumeButtonTexture",
            180,
            225,
            () => {
                this._resumeGame();
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
            () => {this._rootNode.openStoryChatViewWithoutPulling()}
        ).setScale(1.25);
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            (this.scale.width / (this._columns + 1)) * 2,
            1000,
            () => {this.openSubMenu("DocView")}
        ).setScale(1.25);
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "hatAppTexture",
            (this.scale.width / (this._columns + 1)) * 2,
            1300,
            () => {
                this.openSubMenu(this._rootNode.hatView);
            }
        ).setScale(1.25);
        this.add.existing(hatButton);
        if (this.scene.get("Hat View") == null)
            this.scene.add("hatView", this._rootNode.hatView);

        const achievementsButton = new SpriteButton(
            this,
            "achievementsAppTexture",
            (this.scale.width / (this._columns + 1)) * 1,
            1300,
            () => {
                this.openSubMenu(this._achievementView)
            }
        ).setScale(1.25);
        this.add.existing(achievementsButton);

        if (this.scene.get("DocView") == null)
            this.scene.add("DocView", this._rootNode.docView);


        var evalv = new EvaluationView(this._rootNode, this._rootNode.achievementManager);
        this.scene.add("EvaluationView", evalv);

        if (this.scene.get("AchievementView") == null)
            this.scene.add("achievementView", this._achievementView);
    }

    private _resumeGame() {
        this.scene.sleep(this);
        this._rootNode.pauseOrResumeGame(false);
    }

    private openSubMenu(menu) {
        this.scene.launch(menu);
        this.scene.pause();
    }
}
