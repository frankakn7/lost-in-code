import * as Phaser from "phaser";
import SpriteButton from "../ui/SpriteButton";
import {achievements} from "../constants/achievements";



import TrophyTexture from "../assets/achievements/trophy.png";
import {SceneKeys} from "../types/sceneKeys";
import {gameController} from "../main";



export default class AchievementViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite; // Background
    // private _manager: AchievementManager; // Reference to the achievement manager
    // private _worldViewScene: WorldViewScene; // Reference to the root node

    private _sprites = [] // Array of achievement sprites to be drawn
    private _margin = 30; // Margin between the sprites
    private _achievementWidth = 200; // Width of the achievement sprites
    private _achievementHeight = 200; // Height of the achievement sprites

    private borderThickness = 20; // Thickness of the border around the achievement sprites

    /**
     * Constructs a new instance of the class.
     * @param worldViewScene
     * @param manager
     */
    constructor() {
        super(SceneKeys.ACHIEVEMENT_VIEW_SCENE_KEY);
    }

    /**
     * Preload assets.
     */
    preload() {

        this.load.image("trophy", TrophyTexture);
    }

    /**
     * Creates the Achievement View scene.
     * Sets up the UI and visual elements for displaying achievements.
     */
    public create() {
        // Create and set the background tile sprite.
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3);

        // Create the return button for navigating back to the main menu.
        const resumeButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {this._backToMenu()}
        );
        this.add.existing(resumeButton);

        // Add the trophy image representing achievements at a specific position and scale.
        this.add.image(this.cameras.main.width / 2, 600, "trophy").setOrigin(0.5, 0.5).setScale(13, 13);

        // Draw the list of achievements on the Achievement View.
        this._drawAchievements();
    }

    /**
     * Draws the unlocked achievements on the Achievement View.
     * Renders each unlocked achievement as an image on a grid-like layout.
     */
    private _drawAchievements() {
        let unlocked = gameController.acheivementManager.unlocked;
        let canvasWidth = this.cameras.main.displayWidth;

        // Calculate the number of achievement objects that can fit in a row.
        let objectsPerRow = Math.floor(canvasWidth / this._achievementWidth);

        // Calculate the horizontal and vertical spacing between achievements.
        let horizontalSPacing = (canvasWidth - (objectsPerRow * this._achievementWidth)) / (objectsPerRow + 1);
        let verticalSpacing = 20;

        // Initialize the starting positions for drawing the achievements.
        let x = horizontalSPacing;
        let y = horizontalSPacing + 830;

        // Loop through each unlocked achievement and render them as images on the Achievement View.
        for(let i = 0; i < gameController.acheivementManager.unlocked.length; i++) {
            // Create a render texture to represent the achievement's background with a border.
            let rt = this.add.renderTexture(x + this._achievementWidth / 2, y + this._achievementHeight / 2, this._achievementWidth + this.borderThickness, this._achievementHeight + this.borderThickness).setOrigin(0.5, 0.5);
            rt.fill(0x00c8ff);

            // Create the achievement image and set its texture based on the unlocked achievement.
            let achievement = this.add.image(x, y, achievements[unlocked[i]].texture).setOrigin(0, 0);
            achievement.setScale(10, 10);

            // Update the x-position for the next achievement.
            x += this._achievementWidth + horizontalSPacing;

            // Check if the next achievement should start a new row based on the available canvas width.
            if (x + this._achievementWidth > canvasWidth) {
                // Start a new row by resetting the x-position and updating the y-position.
                x = horizontalSPacing;
                y += this._achievementWidth + verticalSpacing;
            }
        }
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

    /**
     * Navigates back to the main menu by resuming the Menu View scene and putting the current Achievement View scene to sleep.
     * Called when the "returnButtonTexture" (resume button) is clicked.
     */
    private _backToMenu() {
        gameController.menuSceneController.backToMenuScene();
    }
}
