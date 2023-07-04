import * as Phaser from "phaser";
import tilesetPng from "./assets/tileset/tileset.png";
import tilemapJson from "./tilemaps/testMap.json";
import { TilemapConfig } from "./types/tilemapConfig";
import RoomScene from "./rooms/room";
import PlayView from "./views/playView";
import ChatView from "./views/chatView/chatView";
import './font.css';

/**
 * Testing the tile config
 */
const tilemapConfig: TilemapConfig = {
    tilesetImage: tilesetPng,
    tilesetName: "Walls-Floors",
    tilemapJson: tilemapJson,
    floorLayer: "Floor",
    collisionLayer: "Walls",
    objectsLayer: "GameObjects"
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 375,
    height: 812,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    input: {
        activePointers: 3
    },
    scale: {
        // Fit to window
        // width: window.innerWidth,
        // height: window.innerHeight,
        mode: Phaser.Scale.RESIZE,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: true

    },
    scene: new PlayView(new RoomScene(tilemapConfig, "Room"),"Play"),
    //scene: new ChatView(),
    parent: "game",
    backgroundColor: "#000000",
};

export const game = new Phaser.Game(gameConfig);
