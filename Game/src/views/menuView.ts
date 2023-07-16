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

export default class MenuView extends Phaser.Scene {
    private _tilesprite : Phaser.GameObjects.TileSprite;
    private _playView : PlayView;
    
    private hatView : HatView;

    private _columns = 4;

    public preload() {
        this.load.image("antennaAppTexture", AntennaAppTexture);
        this.load.image("knowledgeAppTexture", KnowledgeButtonTexture);
        this.load.image("settingsAppTexture", SettingsButtonTexture);
        this.load.image("resumeButtonTexture", ResumeButtonTexture);
        this.load.image("logoutButtonTexture", LogoutButtonTexture);
        this.load.image("hatAppTexture", HatAppTexture);
    }

    constructor(
        playView : PlayView,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig,
    ) {
        super(settingsConfig);
        this._playView = playView;
        // this.hatView = new HatView();
    }

    public create() {
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);


        const resumeButton = new SpriteButton(
            this,
            "resumeButtonTexture",
            180,
            180,
            () => {this._resumeGame()}
        );
        this.add.existing(resumeButton);

        const logoutButton = new SpriteButton(
            this,
            "logoutButtonTexture",
            this.cameras.main.displayWidth - 180,
            180,
            () => {}
        );
        this.add.existing(logoutButton);

    
        // Oder was auch immer das dann repräsentieren soll
        const chatButton = new SpriteButton(
            this,
            "antennaAppTexture",
            (this.scale.width / (this._columns + 1)) * 1,
            1000,
            () => {}
        );
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            (this.scale.width / (this._columns + 1)) * 2,
            1000,
            () => {}
        );
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "hatAppTexture",
            (this.scale.width / (this._columns + 1)) * 3,
            1000,
            () => {
                this.openSubMenu(this._playView.hatView)
            }
        );
        this.add.existing(hatButton);
        if (this.scene.get("Hat View") == null) this.scene.add("hatView", this._playView.hatView);

        const settingsButton = new SpriteButton(
            this,
            "settingsAppTexture",
            (this.scale.width / (this._columns + 1)) * 4,
            1000,
            () => {}
        );
        this.add.existing(settingsButton);
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