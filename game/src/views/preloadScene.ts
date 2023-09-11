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
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
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

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        console.log("### PRELOADING")
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

        this.load.image("backgroundTile", deviceBackgroundTilePng);
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
    }

    create(data) {
        this.scene.start('rootNode', { rootNode: data.rootNode });
    }
}
