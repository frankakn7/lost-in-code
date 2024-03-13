import { globalEventBus } from "../helpers/globalEventBus";

import { GameEvents } from "../types/gameEvents";
import PopupSceneController from "./popupSceneController";
import { GameState } from "../managers/gameState";
import ApiHelper from "../helpers/apiHelper";
import WorldSceneController from "./worldSceneController";
import AchievementManager from "../managers/achievementManager";
import { gameController } from "../main";

export default class EventBusController {
    private _popupSceneController: PopupSceneController;
    private _worldSceneController: WorldSceneController;

    private _gameState: GameState;
    private _apiHelper: ApiHelper;

    constructor(
        popupSceneController: PopupSceneController,
        worldSceneController: WorldSceneController,
        gameStateManager: GameState,
        apiHelper: ApiHelper,
    ) {
        this._popupSceneController = popupSceneController;
        this._worldSceneController = worldSceneController;
        this._gameState = gameStateManager;
        this._apiHelper = apiHelper;

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        const broadcastNews = this._popupSceneController.broadcastNews.bind(this._popupSceneController);
        globalEventBus.on(GameEvents.BROADCAST_NEWS, (message) => {
            broadcastNews(message);
        });

        const broadcastAchievement = this._popupSceneController.broadcastAchievement.bind(this._popupSceneController);
        globalEventBus.on(GameEvents.BROADCAST_ACHIEVEMENT, (achievement) => {
            broadcastAchievement(achievement);
        });

        // Set up an event listener for the 'game_finished' event to handle the game completion.
        globalEventBus.once(GameEvents.GAME_FINISHED, () => {
            this._gameState.gameFinished = true;
            globalEventBus.emit(GameEvents.SAVE_GAME);
        });

        // Set up event listener to save the game state when 'save_game' event is emitted.
        globalEventBus.on(GameEvents.SAVE_GAME, () => {
            this._gameState.calculateNewPlayTime();
            if (gameController.savingEnabled) {
                console.log("Saving");
                this._apiHelper.updateStateData(this._gameState).catch((error) => {
                    console.error(error);
                });
            }
        });
    }
}
