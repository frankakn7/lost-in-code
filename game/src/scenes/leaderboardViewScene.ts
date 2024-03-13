import * as Phaser from "phaser";
import { SceneKeys } from "../types/sceneKeys";
import { gameController } from "../main";
import SpriteButton from "../ui/SpriteButton";
import ApiHelper from "../helpers/apiHelper";
import TopThreeContainer from "../ui/Leaderboard/topThreeContainer";
import RestLeaderboardContainer from "../ui/Leaderboard/restLeaderboardContainer";

export default class LeaderboardViewScene extends Phaser.Scene {
    private _tilesprite: Phaser.GameObjects.TileSprite; // Background

    private _apiHelper = new ApiHelper();

    private _topThreeList: TopThreeContainer;
    private _restList: RestLeaderboardContainer;

    private _textStyle = {
        fontSize: "50px",
        fontFamily: "forwardRegular",
        color: "#00c8ff",
    }

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
        // let leaderboard = this.getGroupLeaderboard();
        this.drawLeaderboard();
        // this.events.on("resume", this.getGroupLeaderboard.bind(this));
        // this.events.on("wake", this.getGroupLeaderboard.bind(this));
        this.events.on("resume", this.drawLeaderboard.bind(this));
        this.events.on("wake", this.drawLeaderboard.bind(this));
    }

    private drawLeaderboard() {
        this.getGroupLeaderboard().then((leaderBoard) => {
            // leaderBoard.forEach((user,index) => {
            //     this.add.text(100,50 + 75 * index, index+" | "+user.username + ": "+ user.points, this._textStyle);
            // })
            this._topThreeList ? this._topThreeList.destroy() : null;
            this._topThreeList = new TopThreeContainer(this,0,0, leaderBoard.slice(0,3));
            this.add.existing(this._topThreeList);

            this._restList ? this._restList.destroy() : null;
            this._restList = new RestLeaderboardContainer(this,0,0,leaderBoard);
            this.add.existing(this._restList);
        });
    }

    private async getGroupLeaderboard() {
        const leaderBoard = await this._apiHelper.getGroupLeaderboard();
        leaderBoard.sort((a,b) => b.points - a.points);
        return leaderBoard;
    }

    /**
     * Navigates back to the main menu by resuming the Menu View scene and putting the current Achievement View scene to sleep.
     * Called when the "returnButtonTexture" (resume button) is clicked.
     */
    private _backToMenu() {
        gameController.menuSceneController.backToMenuScene();
    }
}
