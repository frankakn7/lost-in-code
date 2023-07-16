import DoorObject from "./objects/doorObject";
import InteractiveObject from "./objects/interactiveObject";

export const GameObjectMap = {
    door: {
        class: DoorObject,
        params: {
            texture: "door",
            width: 18,
            height: 64
        }
    },
    engine: {
        class: InteractiveObject,
        params: {
            texture: "engine",
            width: 60,
            height: 60
        }
    }
}