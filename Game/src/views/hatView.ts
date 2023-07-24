import { text } from "express";
import { HatMap } from "../constants/hats";
import SpriteButton from "../ui/SpriteButton";
import RootNode from "./rootNode";
import ReturnButtonTexture from "../assets/ui/Return-Button.png"
import DeviceButton from "../ui/deviceButton";
import {globalEventBus} from "../helpers/globalEventBus";


/**
 * HatView is the view where the player can select a hat.
 */
export default class HatView extends Phaser.Scene {
    private _tilesprite : Phaser.GameObjects.TileSprite; // Background
    private _rootNode : RootNode; // Reference to the root node

    private _columns = 4; // Number of columns to display the hats in.

    // Save references to all buttons so to be able to delete them if redraw is necessary.
    private buttonMap = new Map();

    /**
     * Preload assets.
     */
    preload() {
        this.load.image("returnButtonTexture", ReturnButtonTexture);
    }

    /**
     * Constructs a new instance of the class.
     * @param rootNode
     * @param settingsConfig
     */
    constructor(
        rootNode: RootNode,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super("Hat View");
        this._rootNode = rootNode;
    }

    /**
     * The create function for the "hat view" scene.
     * Initializes and sets up the scene, including loading data and creating UI elements.
     */
    public create() {
        // Load data from the game state.
        this.loadData();
        // Draw the background.
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);

        // Draw the return button.
        const resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {this._backToMenu()}
        );
        this.add.existing(resumeButton);

        // Draw the hat buttons.
        this.drawHatButtons();
    }

    /**
     * Loads data from the game state.
     * @private
     */
    private loadData() {
        this._rootNode.user.unlockedHats.forEach(hat => {
            this._rootNode.user.addUnlockedHats(hat);
        });
    }

    /**
     * Draws the hat buttons on the "hat view" scene.
     * Each button represents a hat from the hatMap and allows the player to select a hat.
     * Locked hats will appear with reduced opacity and cannot be selected.
     * When a hat is selected, it updates the player's selected hat and redraws the hat buttons accordingly.
     */
    public drawHatButtons() {
        let hatMap = this._rootNode.hatMap;

        // Initialize a counter to keep track of the number of hats processed.
        let counter = 0;

        // Iterate through each hat in the hatMap.
        for(let prop in hatMap) {
            if (hatMap.hasOwnProperty(prop)) {
                counter++;
                let hat = hatMap[prop];

                // Calculate the position (x, y) for the current hat button based on the counter and layout settings.
                let x = (this.scale.width / (this._columns + 1)) * counter;
                let y = 1000;

                // Adjust the y position and x position if the current counter exceeds the number of hats to fit on a row.
                if (counter > 4) {
                    y = 1200;
                    x -= (this.scale.width / this._columns + 1) * 3;
                }

                // Define the width and height of the hat button texture.
                const width = 32;
                const height = 32;

                // Create a renderTexture for the hat button and draw the hat's texture and background.
                let renderTexture = this.make.renderTexture({
                    width,
                    height
                }, false);
                renderTexture.draw("hatBg", 0, 0);
                renderTexture.draw(hat.texture, 0, 0);

                // If the hat is locked (not unlocked), fill the hat button with a semi-transparent black color.
                if (!this._isHatUnlocked(prop)) {
                    renderTexture.fill(0x000000, 0.7);
                }

                // Create another renderTexture for the selected version of the hat button and draw the selected hat texture and background.
                let renderTextureSelected = this.make.renderTexture({
                    width,
                    height
                }, false);
                renderTextureSelected.draw("hatBgSelected", 0, 2);
                renderTextureSelected.draw(hat.texture, 0, 2);

                // Generate a unique textureKey for the selected hat texture.
                let textureKey = hat.name + "_selected";
                if(!this.textures.exists(textureKey))
                    renderTextureSelected.saveTexture(textureKey);

                // Determine which texture to use for the hat button based on whether the hat is selected or not.
                let texture;
                if (prop == this._rootNode.user.selectedHat) texture = renderTextureSelected.texture;
                else texture = renderTexture.texture;

                // Create a hat button using the SpriteButton class.
                let hatButton = new SpriteButton(
                    this,
                     texture,
                     x,
                     y,
                     () => {
                         // When the hat button is clicked, check if the hat is unlocked.
                         // If unlocked, set the player's selected hat and redraw the hat buttons.
                        if (!this._isHatUnlocked(prop)) return;

                        hatButton.setTexture(textureKey);
                        this._rootNode.user.selectedHat = prop;
                        this.deleteAllHatButtons();
                        this.drawHatButtons();
                         globalEventBus.emit("save_game")
                     },
                     180,
                     180,
                     6
                     );
                this.add.existing(hatButton);

                // Store the hat and its corresponding button in the buttonMap for further reference.
                this.buttonMap.set(hat, hatButton);
            }
        }

        // Create a button for removing the current hat (selecting "None").
        let noneButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - 150,
            1400,
            300,
            () => {
                // When the "Remove Hat" button is clicked, set the player's selected hat to "None" and redraw the hat buttons.
                this._rootNode.user.selectedHat = "None";
                this.drawHatButtons();
            },
            "Remove Hat"
        );
        this.add.existing(noneButton);
    }

    /**
     * Deletes all hat buttons from the scene.
     * It iterates through the buttonMap, destroys each button sprite, and clears the buttonMap.
     */
    public deleteAllHatButtons() {
        this.buttonMap.forEach((value, key) => {
            value.destroy();
        });

        this.buttonMap.clear();
    }

    /**
     * Returns the ID of the currently selected hat.
     */
    public getSelectedHatId() {
        return this._rootNode.user.selectedHat;
    }

    /**
     * Goes back to the main menu.
     * @private
     */
    private _backToMenu() {
        this._rootNode.menuView.scene.resume();
        this.scene.sleep();
    }

    // Save the selected hat and unlocked hats to the game state.
    public saveAll() {
        return {
            selectedHat: this._rootNode.user.selectedHat,
            unlockedHats: this._rootNode.user.unlockedHats
        };
    }

    // Check if a hat is unlocked.
    private _isHatUnlocked(hatId: string) {
        let res = (HatMap[hatId].unlocked || this._rootNode.user.unlockedHats.includes(hatId));
        console.log(hatId + " is " +res);
        return res;
    }

    // Unlock a hat.
    public unlock(hatId) {
        console.log("Unlocked " + hatId + "!");
        this._rootNode.user.addUnlockedHats(hatId);
        globalEventBus.emit("save_game")
    }
}