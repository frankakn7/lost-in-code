import NewsPopupScene from "../scenes/newsPopupScene";
import {gameController} from "../main";
import {AchievementType} from "../types/achievementType";
import MasterSceneController from "./masterSceneController";

export default class PopupSceneController {

    private _newsCounter: number = 0;
    private _currentlyDisplayedNews: NewsPopupScene[] = [];

    private _masterSceneController: MasterSceneController;

    constructor(masterSceneController: MasterSceneController) {
        this._masterSceneController = masterSceneController;
    }

    /**
     * Broadcasts a news message to the player.
     * @param {string} message - The news message to be displayed in the popup.
     * @param {string} texture - a texture to be displayed in the popup as well
     */
    public broadcastNews(message: string, texture?: string) {
        let newsId = "newsPopup" + (this._newsCounter++).toString();
        let newsPopup = new NewsPopupScene(newsId, message, 2500, texture);
        this.addNewsPopupScene(newsId,newsPopup);
    }

    /**
     * Broadcast an achievent news popup to the player
     * @param {AchievementType} achievement - achievement to be broadcast
     */
    public broadcastAchievement(achievement: AchievementType) {
        this.broadcastNews(achievement.text,achievement.texture);
    }

    /**
     * Creates and displays a new NewsPopupScene with the given newsPopup.
     * If there are existing news popups, they will be removed before showing the new one.
     * @param {string} newsId - the scene id to be used for the newsPopupScene
     * @param {NewsPopupScene} newsPopup - the newsPopup scene to be displayed
     * @private
     */
    private addNewsPopupScene(newsId: string, newsPopup: NewsPopupScene){
        this._masterSceneController.addScene(newsId, newsPopup);
        this._masterSceneController.runScene(newsId);

        if (this._currentlyDisplayedNews.length > 0) {
            this._currentlyDisplayedNews.forEach((n) => {
                n.kill();
            })
        }
        this._currentlyDisplayedNews.push(newsPopup)
    }
}