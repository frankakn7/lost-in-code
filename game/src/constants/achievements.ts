import {AchievementType} from "../types/achievementType";

export const achievements: Record<string, AchievementType> = {
    tasks_5: {
        texture: "badge_tasks_5",
        text: "You finished 5 exercises!"
    },
    tasks_10: {
        texture: "badge_tasks_10",
        text: "You fixed 10 exercises!"
    },
    tasks_20: {
        texture: "badge_tasks_20",
        text: "You fixed 20 exercises!"
    },
    tasks_30: {
        texture: "badge_tasks_30",
        text: "You fixed 30 exercises!"
    },
    tasks_40: {
        texture: "badge_tasks_40",
        text: "You fixed 40 exercises!"
    },
    tasks_50: {
        texture: "badge_tasks_50",
        text: "You fixed 50 exercises!"
    },
    levels_hangar: {
        texture: "badge_levels_hangar",
        text: "You made it through the hangar!"
    },

    levels_commonRoom: {
        texture: "badge_levels_common",
        text: "You made it through the common room!"
    },

    levels_engine: {
        texture: "badge_levels_engine",
        text: "You made it through the engine room!"
    },

    levels_bridge: {
        texture: "badge_levels_bridge",
        text: "You finished the game!"
    },
}