import { text } from "express";
import { HatMap } from "../../hats/hats";
import SpriteButton from "../../ui/SpriteButton";
import PlayView from "../playView";
import ReturnButtonTexture from "../../assets/ui/Return-Button.png"
import DeviceButton from "../../ui/deviceButton";
import {globalEventBus} from "../../helpers/globalEventBus";

export default class HatView extends Phaser.Scene {
    private _tilesprite : Phaser.GameObjects.TileSprite;
    private _playView : PlayView;

    private _selectedHatId: string = "None";

    private _rows = 2;
    private _columns = 4;

    // Save references to all buttons so to be able to delete them if redraw is necessary.
    private buttonMap = new Map();

    private unlockedHats = [];

    preload() {
        this.load.image("returnButtonTexture", ReturnButtonTexture);
    }

    constructor(
        playView: PlayView,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super("Hat View");
        this._playView = playView;
    }

    public create() {
        this.loadData();
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);
        
        const resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {this._backToMenu()}
        );
        this.add.existing(resumeButton);


        this.drawHatButtons();
    }

    private loadData() {
        this._playView.getState().hats.unlockedHats.forEach(hat => {
            this.unlockedHats.push(hat);
        });

       this.loadSelectedHat()
    }

    public loadSelectedHat() {
        if(this._playView.getState().hats.selectedHat){
            this._selectedHatId = this._playView.getState().hats.selectedHat;
        }
    }

    public drawHatButtons() {
        let hatMap = this._playView.hatMap;

        let counter = 0
        for(let prop in hatMap) {
            if (hatMap.hasOwnProperty(prop)) {
                counter++;
                let hat = hatMap[prop];

                let x = (this.scale.width / (this._columns + 1)) * counter;
                
                let y = 1000;
                if (counter > 4) {
                    y = 1200;
                    x -= (this.scale.width / this._columns + 1) * 3;
                }

                const width = 32;
                const height = 32;

                let renderTexture = this.make.renderTexture({
                    width,
                    height
                }, false);  
                renderTexture.draw("hatBg", 0, 0);
                renderTexture.draw(hat.texture, 0, 0);
                
                if (!this._isHatUnlocked(prop)) {
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
                        if (!this._isHatUnlocked(prop)) return;
                        hatButton.setTexture(textureKey);
                        this._selectedHatId = prop;
                        this.deleteAllHatButtons();
                        this.drawHatButtons();
                         globalEventBus.emit("save_game")
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
            1400,
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

    
    private _backToMenu() {
        this._playView.menuView.scene.resume();
        this.scene.sleep();
    }

    public saveAll() {
        return {
            selectedHat: this._selectedHatId,
            unlockedHats: this.unlockedHats
        };
    }

    private _isHatUnlocked(hatId: string) {
        let res = (HatMap[hatId].unlocked || this.unlockedHats.includes(hatId));
        console.log(hatId + " is " +res);
        return res;
    }

    public unlock(hatId) {
        console.log("Unlocked " + hatId + "!");
        this.unlockedHats.push(hatId);
        globalEventBus.emit("save_game")
    }
}