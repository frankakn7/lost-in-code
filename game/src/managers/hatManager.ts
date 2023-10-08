import {HatMap} from "../constants/hatMap";
import {gameController} from "../main";
import {globalEventBus} from "../helpers/globalEventBus";
import {GameEvents} from "../types/gameEvents";

export default class HatManager {
    // Check if a hat is unlocked.
    public isHatUnlocked(hatId: string) {
        let res = gameController.gameStateManager.user.unlockedHats.includes(hatId);
        return res;
    }

    // Unlock a hat.
    public unlock(hatId) {
        gameController.gameStateManager.addUnlockedHats(hatId);
        globalEventBus.emit(GameEvents.SAVE_GAME)
    }
}