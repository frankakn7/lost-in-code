import {globalEventBus} from "../helpers/globalEventBus";
import {gameController} from "../main";
import {GameEvents} from "../types/gameEvents";

export default class EventBusController {

    constructor() {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        const broadcastNews = gameController.popupSceneController.broadcastNews.bind(this);
        globalEventBus.on(GameEvents.BROADCAST_NEWS, (message) => {
            broadcastNews(message)
        })

        const broadcastAchievement = gameController.popupSceneController.broadcastAchievement.bind(this);
        globalEventBus.on(GameEvents.BROADCAST_ACHIEVEMENT, (achievement) => {
            broadcastAchievement(achievement)
        });

        // Set up an event listener for the 'game_finished' event to handle the game completion.
        globalEventBus.once(GameEvents.GAME_FINISHED, (() => {
            gameController.gameStateManager.gameFinished = true;
            globalEventBus.emit(GameEvents.SAVE_GAME);
        }))

        // Set up an event listener for the 'chat_closed' event to open the evaluation view when the game is finished.
        globalEventBus.on(GameEvents.CHAT_CLOSED, (() => {
            if (gameController.gameStateManager.gameFinished) {
                gameController.worldSceneController.startEvaluationScene();
            }
        }));

        // Set up event listener to save the game state when 'save_game' event is emitted.
        globalEventBus.on(GameEvents.SAVE_GAME, () => gameController.apiHelper.updateStateData(gameController.gameStateManager).catch((error) => {
            console.error(error);
        }))
    }
}