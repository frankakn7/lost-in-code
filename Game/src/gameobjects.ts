import InteractiveObject from "./objects/interactiveObject";

export const GameObjectMap = {
    door: {
        class: InteractiveObject,
        params: {
            texture: "door"
        }
    },
    engine: {
        class: InteractiveObject,
        params: {
            texture: "engine"
        }
    }
}