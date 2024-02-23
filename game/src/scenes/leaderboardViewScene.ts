import * as Phaser from "phaser";
import { SceneKeys } from "../types/sceneKeys";
import { gameController } from "../main";
import SpriteButton from "../ui/SpriteButton";

export default class LeaderboardViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite; // Background

    constructor() {
        super(SceneKeys.LEADERBOARD_VIEW_SCENE_KEY);
    }

    /**
     * Creates the Achievement View scene.
     * Sets up the UI and visual elements for displaying achievements.
     */
    public create() {
        // Create and set the background tile sprite.
        this._tilesprite = this.add
            .tileSprite(0, 0, this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile")
            .setOrigin(0, 0)
            .setScale(3);

        // Create the return button for navigating back to the main menu.
        const resumeButton = new SpriteButton(this, "returnButtonTexture", 180, 180, () => {
            this._backToMenu();
        });
        this.add.existing(resumeButton);

        //TODO Create table of players and their rankings
    }

    /**
     * Navigates back to the main menu by resuming the Menu View scene and putting the current Achievement View scene to sleep.
     * Called when the "returnButtonTexture" (resume button) is clicked.
     */
    private _backToMenu() {
        gameController.menuSceneController.backToMenuScene();
    }
}
