import * as Phaser from "phaser";
import tilesetPng from "./assets/tileset.png";
import tilemapJson from "./assets/testMap.json";
import { TilemapConfig } from "./types/tilemapConfig";
import RoomScene from "./rooms/room";

/**
 * Testing the tile config
 */
const tilemapConfig: TilemapConfig = {
    tilesetImage: tilesetPng,
    tilesetName: "Walls-Floors",
    tilemapJson: tilemapJson,
    floorLayer: "Floor",
    collisionLayer: "Walls"
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // width: 960,
    // height: 640,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    input: {
        activePointers: 3
    },
    scale: {
        // Fit to window
        width: window.innerWidth,
        height: window.innerHeight,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: new RoomScene(tilemapConfig, "Room"),
    parent: "game",
    backgroundColor: "#000000",
};

export const game = new Phaser.Game(gameConfig);
