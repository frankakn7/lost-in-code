import * as Phaser from "phaser";
import DeviceButton from "../ui/deviceButton";
import SpriteButton from "../ui/SpriteButton";
import PlayView from "./playView";

import AntennaAppTexture from "../assets/ui/apps/Antenna-app-icon.png";
import ResumeButtonTexture from "../assets/ui/Resume-Button.png";
import SettingsButtonTexture from "../assets/ui/apps/Settings-app-icon.png";
import KnowledgeButtonTexture from "../assets/ui/apps/knowledge-app-icon.png";
import HatAppTexture from "../assets/ui/apps/Hat-app-icon.png";
import LogoutButtonTexture from "../assets/ui/Logout-Button.png";
import HatView from "./hatView/hatView";
import ApiHelper from "../helpers/apiHelper";

import AchievementsAppTexture from "../assets/ui/apps/Achievements-app-icon.png";
import AchievementManager from "../achievements/achievementManager";
import AchievementView from "../achievements/achievementView";

export default class MenuView extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite;
    private _playView: PlayView;

    private hatView: HatView;

    private _columns = 4;

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
        playView: PlayView,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super(settingsConfig);
        this._playView = playView;
        // this.hatView = new HatView();
        this._achievementView = new AchievementView(this._playView, this._playView.achievementManager);
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
            (this.scale.width / (this._columns )) * 1,
            1000,
            () => {this._playView.openStoryChatViewWithoutPulling()}
        );
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            (this.scale.width / (this._columns )) * 2,
            1000,
            () => {this.openSubMenu("DocView")}
        );
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "hatAppTexture",
            (this.scale.width / (this._columns )) * 3,
            1000,
            () => {
                this.openSubMenu(this._playView.hatView);
            }
        );
        this.add.existing(hatButton);
        if (this.scene.get("Hat View") == null)
            this.scene.add("hatView", this._playView.hatView);

        const achievementsButton = new SpriteButton(
            this,
            "achievementsAppTexture",
            (this.scale.width / (this._columns )) * 1.5,
            1224,
            () => {
                this.openSubMenu(this._achievementView)
            }
        );
        this.add.existing(achievementsButton);

        if (this.scene.get("DocView") == null)
            this.scene.add("DocView", this._playView.docView);


        const settingsButton = new SpriteButton(
            this,
            "settingsAppTexture",
            (this.scale.width / (this._columns )) * 2.5,
            1224,
            () => {
            }
        );
        this.add.existing(settingsButton);

        if (this.scene.get("AchievementView") == null)
            this.scene.add("achievementView", this._achievementView);
    }

    private _resumeGame() {
        this.scene.sleep(this);
        this._playView.pauseOrResumeGame(false);
    }

    private openSubMenu(menu) {
        this.scene.launch(menu);
        this.scene.pause();
    }
}
