import { HatMap } from "../constants/hatMap";
import SpriteButton from "../ui/SpriteButton";
import DeviceButton from "../ui/deviceButton";
import { globalEventBus } from "../helpers/globalEventBus";
import { gameController } from "../main";
import { SceneKeys } from "../types/sceneKeys";
import { GameEvents } from "../types/gameEvents";

/**
 * HatViewScene is the view where the player can select a hat.
 */
export default class HatViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite; // Background

    private _columns = 4; // Number of columns to display the hats in.

    // Save references to all buttons so to be able to delete them if redraw is necessary.
    private _buttonMap = new Map();

    /**
     * Constructs a new instance of the class.
     */
    constructor() {
        super(SceneKeys.HAT_VIEW_SCENE_KEY);
    }

    /**
     * The create function for the "hat view" scene.
     * Initializes and sets up the scene, including loading data and creating UI elements.
     */
    public create() {
        // Draw the background.
        this._tilesprite = this.add
            .tileSprite(0, 0, this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile")
            .setOrigin(0, 0)
            .setScale(3);

        // Draw the return button.
        const resumeButton = new SpriteButton(this, "returnButtonTexture", 180, 180, () => {
            this._backToMenu();
        });
        this.add.existing(resumeButton);

        // Draw the hat buttons.
        this.drawHatButtons();

        this.events.on(
            Phaser.Scenes.Events.WAKE,
            function () {
                this.drawHatButtons();
            },
            this,
        );
    }

    /**
     * Draws the hat buttons on the "hat view" scene.
     * Each button represents a hat from the hatMap and allows the player to select a hat.
     * Locked hats will appear with reduced opacity and cannot be selected.
     * When a hat is selected, it updates the player's selected hat and redraws the hat buttons accordingly.
     */
    public drawHatButtons() {
        // Initialize a counter to keep track of the number of hats processed.
        let counter = 0;
        this.deleteAllHatButtons();

        // Iterate through each hat in the hatMap.
        for (let prop in HatMap) {
            if (HatMap.hasOwnProperty(prop)) {
                counter++;
                let hat = HatMap[prop];

                // Define the width and height of the hat button texture.
                const width = 32;
                const height = 32;
                const padding = 3;
                const scale = 6;

                let row = Math.floor((counter - 1) / this._columns);
                let numRows = Math.ceil(Object.keys(HatMap).length / this._columns);

                // Calculate the position (x, y) for the current hat button based on the counter and layout settings.
                let xStart = (this.cameras.main.width - this._columns * (width + padding) * scale) / 2;
                let x = xStart + (width + padding) * scale * (counter % this._columns) + (width * scale) / 2; // Offset by half the width
                let y =
                    this.cameras.main.height / 2 +
                    row * (height + padding) * scale -
                    numRows * ((height * scale) / 2) +
                    (height * scale) / 2; // Offset by half the height

                // Adjust the y position and x position if the current counter exceeds the number of hats to fit on a row.
                // if (counter > this._columns) {
                //     y = this.cameras.main.height / 2 + 100;
                //     x = (this.cameras.main.width / (this._columns + 1)) * (counter % this._columns) + 1;
                // }

                // Create a renderTexture for the hat button and draw the hat's texture and background.
                let renderTexture = this.make.renderTexture(
                    {
                        width,
                        height,
                    },
                    false,
                );
                renderTexture.draw("hatBg", 0, 0);
                renderTexture.draw(hat.texture, 0, 0);

                // If the hat is locked (not unlocked), fill the hat button with a semi-transparent black color.
                if (!gameController.hatManager.isHatUnlocked(prop)) {
                    renderTexture.fill(0x000000, 0.7);
                }

                // Create another renderTexture for the selected version of the hat button and draw the selected hat texture and background.
                let renderTextureSelected = this.make.renderTexture(
                    {
                        width,
                        height,
                    },
                    false,
                );
                renderTextureSelected.draw("hatBgSelected", 0, 0);
                renderTextureSelected.draw(hat.texture, 0, 0);

                // Generate a unique textureKey for the selected hat texture.
                let textureKey = hat.name + "_selected";
                if (!this.textures.exists(textureKey)) renderTextureSelected.saveTexture(textureKey);

                // Determine which texture to use for the hat button based on whether the hat is selected or not.
                let texture;
                if (prop == gameController.gameStateManager.user.selectedHat) texture = renderTextureSelected.texture;
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
                        if (!gameController.hatManager.isHatUnlocked(prop)) return;

                        hatButton.setTexture(textureKey);
                        gameController.gameStateManager.user.selectedHat = prop;
                        this.deleteAllHatButtons();
                        this.drawHatButtons();
                        globalEventBus.emit(GameEvents.SAVE_GAME);
                    },
                    height * scale,
                    width * scale,
                    scale,
                );
                this.add.existing(hatButton);

                // Store the hat and its corresponding button in the buttonMap for further reference.
                this._buttonMap.set(hat, hatButton);
            }
        }

        // Create a button for removing the current hat (selecting "None").
        let noneButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - 150,
            this.cameras.main.displayHeight * 0.8,
            300,
            () => {
                // When the "Remove Hat" button is clicked, set the player's selected hat to "None" and redraw the hat buttons.
                gameController.gameStateManager.user.selectedHat = "None";
                this.drawHatButtons();
            },
            "Remove Hat",
        );
        this.add.existing(noneButton);
    }

    /**
     * Deletes all hat buttons from the scene.
     * It iterates through the buttonMap, destroys each button sprite, and clears the buttonMap.
     */
    public deleteAllHatButtons() {
        this._buttonMap.forEach((value, key) => {
            value.destroy();
        });

        this._buttonMap.clear();
    }

    /**
     * Goes back to the main menu.
     * @private
     */
    private _backToMenu() {
        gameController.menuSceneController.backToMenuScene();
    }
}
