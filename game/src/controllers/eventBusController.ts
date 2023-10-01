import {globalEventBus} from "../helpers/globalEventBus";

import {GameEvents} from "../types/gameEvents";
import PopupSceneController from "./popupSceneController";
import {GameStateManager} from "../managers/gameStateManager";
import ApiHelper from "../helpers/apiHelper";
import WorldSceneController from "./worldSceneController";

export default class EventBusController {

    private _popupSceneController: PopupSceneController;
    private _worldSceneController: WorldSceneController;

    private _gameStateManager: GameStateManager;
    private _apiHelper: ApiHelper;

    constructor(popupSceneController: PopupSceneController, worldSceneController: WorldSceneController, gameStateManager: GameStateManager, apiHelper: ApiHelper) {
        this._popupSceneController = popupSceneController;
        this._worldSceneController = worldSceneController;
        this._gameStateManager = gameStateManager;
        this._apiHelper = apiHelper;

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        const broadcastNews = this._popupSceneController.broadcastNews.bind(this._popupSceneController);
        globalEventBus.on(GameEvents.BROADCAST_NEWS, (message) => {
            broadcastNews(message)
        })

        const broadcastAchievement = this._popupSceneController.broadcastAchievement.bind(this._popupSceneController);
        globalEventBus.on(GameEvents.BROADCAST_ACHIEVEMENT, (achievement) => {
            broadcastAchievement(achievement)
        });

        // Set up an event listener for the 'game_finished' event to handle the game completion.
        globalEventBus.once(GameEvents.GAME_FINISHED, (() => {
            this._gameStateManager.gameFinished = true;
            globalEventBus.emit(GameEvents.SAVE_GAME);
        }))

        // Set up an event listener for the 'chat_closed' event to open the evaluation view when the game is finished.
        globalEventBus.on(GameEvents.CHAT_CLOSED, (() => {
            if (this._gameStateManager.gameFinished) {
                this._worldSceneController.startEvaluationScene();
            }
        }));

        // Set up event listener to save the game state when 'save_game' event is emitted.
        globalEventBus.on(GameEvents.SAVE_GAME, () => {
            this._apiHelper.updateStateData(this._gameStateManager).catch((error) => {
                console.error(error);
            })
        })
    }
}