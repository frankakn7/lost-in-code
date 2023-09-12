import * as Phaser from "phaser";
import RootNode from "./views/rootNode";
import LoginView from "./views/loginView";
import PreloadScene from "./views/preloadScene";
import './font.css';
import {GameStateManager} from "./managers/gameStateManager";
import Center = Phaser.Scale.Center;

class GameController {
    private _gameConfig: Phaser.Types.Core.GameConfig;
    private _game: Phaser.Game;
    private _gameStateManager: GameStateManager;
    private _currentScene: string;

    readonly SIZE_WIDTH_SCREEN = 375*2.5;
    readonly SIZE_HEIGHT_SCREEN = 812*2.5;
    readonly MAX_SIZE_WIDTH_SCREEN = 750*2;
    readonly MAX_SIZE_HEIGHT_SCREEN= 1624*2;
    readonly MIN_SIZE_WIDTH_SCREEN = 375*2;
    readonly MIN_SIZE_HEIGHT_SCREEN = 812*2;
    constructor() {
        this._gameConfig = {
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
                mode: Phaser.Scale.FIT,
                // mode: Phaser.Scale.RESIZE,
                parent: 'game',
                width: this.SIZE_WIDTH_SCREEN,
                height: this.SIZE_HEIGHT_SCREEN,
                min: {
                    width: this.MIN_SIZE_WIDTH_SCREEN,
                    height: this.MIN_SIZE_HEIGHT_SCREEN
                },
                max: {
                    width: this.MAX_SIZE_WIDTH_SCREEN,
                    height: this.MAX_SIZE_HEIGHT_SCREEN
                }
                // Center vertically and horizontally
                // autoCenter: Phaser.Scale.CENTER_BOTH,
                // autoRound: true

            },
            autoCenter: Center.CENTER_BOTH,
            // scene: new RootNode(),
            // scene: new LoginView(),
            scene: [LoginView, PreloadScene],
            // scene: new ChatView(),
            parent: "game",
            dom: {
                createContainer: true
            },
            backgroundColor: "#000000",
        };

        this._game = new Phaser.Game(this._gameConfig);
        this._gameStateManager = new GameStateManager();  // Placeholder for your game state data
        this._currentScene = "LoginView";
    }

    // Your methods to manage game state, switch scenes, etc.
    switchScene(newScene: string) {
        this._game.scene.stop(this._currentScene);
        this._game.scene.start(newScene);
        this._currentScene = newScene;
    }
}

// Initialize GameController and start the game
export const gameController = new GameController();
