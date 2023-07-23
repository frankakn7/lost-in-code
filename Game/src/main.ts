import * as Phaser from "phaser";
import RootNode from "./views/rootNode";
import './font.css';
import Center = Phaser.Scale.Center;


/**
 * Testing the tile config
 */

const SIZE_WIDTH_SCREEN = 375*2.5;
const SIZE_HEIGHT_SCREEN = 812*2.5;
const MAX_SIZE_WIDTH_SCREEN = 750*2;
const MAX_SIZE_HEIGHT_SCREEN= 1624*2;
const MIN_SIZE_WIDTH_SCREEN = 375*2;
const MIN_SIZE_HEIGHT_SCREEN = 812*2;

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
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
        // mode: Phaser.Scale.FIT,
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: SIZE_WIDTH_SCREEN,
        height: SIZE_HEIGHT_SCREEN,
        min: {
            width: MIN_SIZE_WIDTH_SCREEN,
            height: MIN_SIZE_HEIGHT_SCREEN
        },
        max: {
            width: MAX_SIZE_WIDTH_SCREEN,
            height: MAX_SIZE_HEIGHT_SCREEN
        }
        // Center vertically and horizontally
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        // autoRound: true

    },
    autoCenter: Center.CENTER_BOTH,
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
