import { text } from "express";
import { HatMap } from "../../hats/hats";
import SpriteButton from "../../ui/SpriteButton";
import PlayView from "../playView";
import ReturnButtonTexture from "../../assets/ui/Return-Button.png";
import DeviceButton from "../../ui/deviceButton";

export default class HatView extends Phaser.Scene {
    private _tilesprite : Phaser.GameObjects.TileSprite;
    private _playView : PlayView;

    private _selectedHatId: string = "None";

    private _rows = 2;
    private _columns = 4;

    // Save references to all buttons so to be able to delete them if redraw is necessary.
    private buttonMap = new Map();

    preload() {
        this.load.image("returnButtonTexture", ReturnButtonTexture);
    }

    constructor(
        playView: PlayView,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super(settingsConfig);
        this._playView = playView;
    }

    public create() {
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);
        
        const resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {this._resumeGame()}
        );
        this.add.existing(resumeButton);


        this.drawHatButtons();
    }

    public drawHatButtons() {
        let hatMap = this._playView.hatMap;

        let counter = 0
        for(let prop in hatMap) {
            if (hatMap.hasOwnProperty(prop)) {
                let hat = hatMap[prop];
                counter++;

                let x = (this.scale.width / (this._columns + 1)) * counter;
                let y = 600;

                const width = 32;
                const height = 32;

                let renderTexture = this.make.renderTexture({
                    width,
                    height
                }, false);  
                renderTexture.draw("hatBg", 0, 0);
                renderTexture.draw(hat.texture, 0, 0);
                
                if (!hat.unlocked) {
                    renderTexture.fill(0x000000, 0.7);
                }

                let renderTextureSelected = this.make.renderTexture({
                    width,
                    height
                }, false);
                renderTextureSelected.draw("hatBgSelected", 0, 2);
                renderTextureSelected.draw(hat.texture, 0, 2);

                let textureKey = hat.name + "_selected";
                if(!this.textures.exists(textureKey))
                    renderTextureSelected.saveTexture(textureKey);

                let texture;
                if (prop == this._selectedHatId) texture = renderTextureSelected.texture;
                else texture = renderTexture.texture;

                let hatButton = new SpriteButton(
                    this,
                     texture, 
                     x, 
                     y,
                     () => {
                        if (!hat.unlocked) return;
                        hatButton.setTexture(textureKey);
                        this._selectedHatId = prop;
                        this.deleteAllHatButtons();
                        this.drawHatButtons();
                     },
                     180,
                     180,
                     6
                     );
                this.add.existing(hatButton);
                this.buttonMap.set(hat, hatButton);
            }
        }

        let noneButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - 150,
            1100,
            300,
            () => {
                this._selectedHatId = "None";
                this.drawHatButtons();
            },
            "Remove Hat"
        );
        this.add.existing(noneButton);
    }

    public deleteAllHatButtons() {
        this.buttonMap.forEach((value, key) => {
            value.destroy();
        });

        this.buttonMap.clear();
    }

    public getSelectedHatId() {
        return this._selectedHatId;
    }

    // TODO IMPORTANT: Remove this as soon as menu class works
    private _resumeGame() {
        this.scene.sleep(this);
        this._playView.pauseOrResumeGame(false);
    }
}