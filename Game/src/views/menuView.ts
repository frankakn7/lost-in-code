import * as Phaser from "phaser";
import DeviceButton from "../ui/deviceButton";
import SpriteButton from "../ui/SpriteButton";
import PlayView from "./playView";

import AntennaAppTexture from "../assets/ui/apps/Antenna-app-icon.png";
import ResumeButtonTexture from "../assets/ui/Resume-Button.png";
import SettingsButtonTexture from "../assets/ui/apps/Settings-app-icon.png";
import KnowledgeButtonTexture from "../assets/ui/apps/knowledge-app-icon.png";
import LogoutButtonTexture from "../assets/ui/Logout-Button.png";
import HatView from "./hatView/hatView";

export default class MenuView extends Phaser.Scene {
    private _tilesprite : Phaser.GameObjects.TileSprite;
    private _playView : PlayView;
    
    private hatView : HatView;

    public preload() {
        this.load.image("antennaAppTexture", AntennaAppTexture);
        this.load.image("knowledgeAppTexture", KnowledgeButtonTexture);
        this.load.image("settingsAppTexture", SettingsButtonTexture);
        this.load.image("resumeButtonTexture", ResumeButtonTexture);
        this.load.image("logoutButtonTexture", LogoutButtonTexture);
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

        const settingsButton = new SpriteButton(
            this,
            "settingsAppTexture",
            180,
            1200,
            () => {}
        );
        this.add.existing(settingsButton);


        // Oder was auch immer das dann repräsentieren soll
        const chatButton = new SpriteButton(
            this,
            "antennaAppTexture",
            180,
            1000,
            () => {}
        );
        this.add.existing(chatButton);

        const knowledgeButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            180,
            1400,
            () => {}
        );
        this.add.existing(knowledgeButton);

        const hatButton = new SpriteButton(
            this,
            "knowledgeAppTexture",
            400,
            1400,
            () => {
            }
        );
        this.add.existing(hatButton);
        // this.scene.add("scene_key", new HatView(this.scene));
        
    }

    private _resumeGame() {
        this.scene.sleep(this);
        this._playView.pauseOrResumeGame(false);
    }

    private openSubMenu(menu) {
        this.scene.launch(this.hatView);
        this.scene.sleep();
    }
}