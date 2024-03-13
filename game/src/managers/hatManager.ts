import { HatMap } from "../constants/hatMap";
import { gameController } from "../main";
import { globalEventBus } from "../helpers/globalEventBus";
import { GameEvents } from "../types/gameEvents";

export default class HatManager {
    // Check if a hat is unlocked.
    public isHatUnlocked(hatId: string) {
        return gameController.gameStateManager.user.unlockedHats.includes(hatId);
    }

    // Unlock a hat.
    public unlock(hatId) {
        gameController.gameStateManager.addUnlockedHats(hatId);
        gameController.gameStateManager.addPoints(10); //10 points per unlocked hat!
        globalEventBus.emit(GameEvents.SAVE_GAME);
    }
}
