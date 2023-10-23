// PreloadScene.js
import ATask5Texture from "../assets/achievements/badges_tasks/badge_tasks_5.png";
import ATask10Texture from "../assets/achievements/badges_tasks/badge_tasks_10.png";
import ATask20Texture from "../assets/achievements/badges_tasks/badge_tasks_20.png";
import ATask30Texture from "../assets/achievements/badges_tasks/badge_tasks_30.png";
import ATask40Texture from "../assets/achievements/badges_tasks/badge_tasks_40.png";
import ATask50Texture from "../assets/achievements/badges_tasks/badge_tasks_50.png";
import ALevels1Texture from "../assets/achievements/badges_levels/badge_level_1.png";
import ALevels2Texture from "../assets/achievements/badges_levels/badge_level_2.png";
import ALevels3Texture from "../assets/achievements/badges_levels/badge_level_3.png";
import ALevels4Texture from "../assets/achievements/badges_levels/badge_level_4.png";
import ALevels5Texture from "../assets/achievements/badges_levels/badge_level_5.png";
import strawHatTexture from "../assets/hats/strawHat.png";
import sorcerersHatTexture from "../assets/hats/redHat.png";
import blackHatTexture from "../assets/hats/blackHat.png";
import sombreroTexture from "../assets/hats/sombrero.png";
import propellerHatTexture from "../assets/hats/propellerHat.png";
import truckerCapTexture from "../assets/hats/truckerCap.png";
import hatBg from "../assets/hats/hatBg.png";
import hatBgSelected from "../assets/hats/hatBgSelected.png";
import tilesetPng from "../assets/tileset/station_tilemap.png";
import crownTexture from "../assets/hats/crown.png";
import pirateHat from "../assets/hats/pirateHat.png";
import flaresPng from "../assets/particles/flares.png";
import flaresJson from "../assets/particles/flares.json";
import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";
import PlayerTexture from "../assets/player.png";
import ShadowTexture from "../assets/shadow.png";
import Mask from "../assets/mask.png";
import DoorTexture from "../assets/gameobjects/door.png";
import EngineTexture from "../assets/gameobjects/engine.png";
import LockerTexture from "../assets/gameobjects/locker.png";
import BarrelTexture from "../assets/gameobjects/barrel.png";
import Crate2Texture from "../assets/gameobjects/crate2.png";
import CrateTexture from "../assets/gameobjects/crate.png";
import Crate4Texture from "../assets/gameobjects/crate4.png";
import ComputerTexture from "../assets/gameobjects/computer.png";
import CannonTexture from "../assets/gameobjects/cannon.png";
import TableSeatLeftTexture from "../assets/gameobjects/tableSeatLeft.png";
import TableSeatRightTexture from "../assets/gameobjects/tableSeatRight.png";
import FirstAidKitTexture from "../assets/gameobjects/firstAidKit.png";
import BedTexture from "../assets/gameobjects/bed.png";
import DoorSingleTexture from "../assets/gameobjects/doorSingle.png";
import DoorDoubleTexture from "../assets/gameobjects/doorDouble.png";
import EngineBrokenTexture from "../assets/gameobjects/engineBroken.png";
import EnemyTexture from "../assets/gameobjects/enemy.png";
import PaperTexture from "../assets/gameobjects/paper2.png";
import AntennaAppTexture from "../assets/ui/apps/Antenna-app-icon.png";
import KnowledgeButtonTexture from "../assets/ui/apps/knowledge-app-icon.png";
import SettingsButtonTexture from "../assets/ui/apps/Settings-app-icon.png";
import ResumeButtonTexture from "../assets/ui/Resume-Button.png";
import LogoutButtonTexture from "../assets/ui/Logout-Button.png";
import AchievementsAppTexture from "../assets/ui/apps/Achievements-app-icon.png";
import HatAppTexture from "../assets/ui/apps/Hat-app-icon.png";
import ReturnButtonTexture from "../assets/ui/Return-Button.png";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super(SceneKeys.PRELOAD_SCENE_KEY);
    }

    preload() {

        this.load.image("badge_tasks_5", ATask5Texture);
        this.load.image("badge_tasks_10", ATask10Texture);
        this.load.image("badge_tasks_20", ATask20Texture);
        this.load.image("badge_tasks_30", ATask30Texture);
        this.load.image("badge_tasks_40", ATask40Texture);
        this.load.image("badge_tasks_50", ATask50Texture);

        this.load.image("badge_levels_hangar", ALevels1Texture);
        this.load.image("badge_levels_common", ALevels2Texture);
        this.load.image("badge_levels_engine", ALevels3Texture);
        this.load.image("badge_levels_lab", ALevels4Texture);
        this.load.image("badge_levels_bridge", ALevels5Texture);

        this.load.image("strawHat", strawHatTexture);
        this.load.image("sorcerersHat", sorcerersHatTexture);
        this.load.image("blackHat", blackHatTexture);
        this.load.image("sombrero", sombreroTexture);
        this.load.image("propellerHat", propellerHatTexture);
        this.load.image("truckerCap", truckerCapTexture);
        this.load.image("hatBg", hatBg);
        this.load.image("hatBgSelected", hatBgSelected);
        this.load.image("tilesetImage", tilesetPng);
        this.load.image("crown", crownTexture);
        this.load.image("pirateHat", pirateHat);

        this.load.atlas("flares", flaresPng, flaresJson);

        // this.load.image("playerTexture", PlayerTexture);
        this.load.image("playerTexture", PlayerTexture);
        this.load.image("shadowTexture", ShadowTexture);
        this.load.image("mask", Mask);
        this.load.image("door", DoorTexture);
        this.load.image("engine", EngineTexture);
        this.load.image("locker", LockerTexture);

        this.load.image("barrel", BarrelTexture);
        this.load.image("crate2", Crate2Texture);
        this.load.image("crate", CrateTexture);
        this.load.image("crate4", Crate4Texture);
        this.load.image("computer", ComputerTexture);
        this.load.image("cannon", CannonTexture);
        this.load.image("tableseatleft", TableSeatLeftTexture);
        this.load.image("tableseatright", TableSeatRightTexture);
        this.load.image("firstaidkittexture", FirstAidKitTexture);
        this.load.image("bed", BedTexture);
        this.load.image("doorSingle", DoorSingleTexture);
        this.load.image("doorDouble", DoorDoubleTexture);
        this.load.image("engineBroken", EngineBrokenTexture);
        this.load.image("enemy", EnemyTexture);

        this.load.image("paper", PaperTexture);

        this.load.image("antennaAppTexture", AntennaAppTexture);
        this.load.image("knowledgeAppTexture", KnowledgeButtonTexture);
        this.load.image("settingsAppTexture", SettingsButtonTexture);
        this.load.image("resumeButtonTexture", ResumeButtonTexture);
        this.load.image("logoutButtonTexture", LogoutButtonTexture);
        this.load.image("achievementsAppTexture", AchievementsAppTexture);
        this.load.image("hatAppTexture", HatAppTexture);

        this.load.image("returnButtonTexture", ReturnButtonTexture)
    }

    create() {
        gameController.initialWorldViewStart()
    }
}
