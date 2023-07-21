import * as Phaser from "phaser";
import RoomScene from "./classes/room";
import RootNode from "./views/rootNode";
import ChatView from "./views/chatView";
import './font.css';
import LoginView from "./views/loginView";
import { application } from "express";

/**
 * Testing the tile config
 */

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 375,
    height: 812,
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
        // width: window.innerWidth,
        // height: window.innerHeight,
        mode: Phaser.Scale.RESIZE,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: true

    },
    // scene: new RootNode(),
    scene: new LoginView(),
    // scene: new ChatView(),
    parent: "game",
    dom: {
        createContainer: true
    },
    backgroundColor: "#000000",
};



  
export const game = new Phaser.Game(gameConfig);
