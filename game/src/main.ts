import * as Phaser from "phaser";
import WorldViewScene from "./scenes/worldViewScene";
import LoginScene from "./scenes/loginScene";
import PreloadScene from "./scenes/preloadScene";
import './font.css';
import {GameStateManager} from "./managers/gameStateManager";
import Center = Phaser.Scale.Center;
import StoryManager from "./managers/story_management/storyManager";
import MasterSceneController from "./controllers/masterSceneController";
import ChatSceneController from "./controllers/chatSceneController";

// @ts-ignore
import SceneWatcherPlugin from 'phaser-plugin-scene-watcher';
import PopupSceneController from "./controllers/popupSceneController";
import AchievementManager from "./managers/achievementManager";
import ApiHelper from "./helpers/apiHelper";
import User from "./classes/user";
import HatManager from "./managers/hatManager";
import ChapterManager from "./managers/chapterManager";
import DocSceneController from "./controllers/docSceneController";
import MenuSceneController from "./controllers/menuSceneController";
import RoomSceneController from "./controllers/roomSceneController";
import TaskManager from "./managers/taskManager";
import QuestionSceneController from "./controllers/questionSceneController";
import {SceneKeys} from "./types/sceneKeys";
import WorldSceneController from "./controllers/worldSceneController";
import EventBusController from "./controllers/eventBusController";

class GameController {
    private _gameConfig: Phaser.Types.Core.GameConfig;

    private _game: Phaser.Game;

    private _gameStateManager: GameStateManager;
    private _storyManager: StoryManager;
    private _acheivementManager: AchievementManager;
    private _hatManager: HatManager;
    private _chapterManager: ChapterManager;
    private _taskManager: TaskManager;

    private _apiHelper: ApiHelper;

    private _user: User;

    private _masterSceneController: MasterSceneController;
    private _chatSceneController: ChatSceneController;
    private _popupSceneController: PopupSceneController;
    private _docSceneController: DocSceneController;
    private _menuSceneController: MenuSceneController;
    private _roomSceneController: RoomSceneController;
    private _questionSceneController: QuestionSceneController;
    private _worldSceneController: WorldSceneController;

    private _eventBusController: EventBusController;

    readonly SIZE_WIDTH_SCREEN = 375 * 2.5;
    readonly SIZE_HEIGHT_SCREEN = 812 * 2.5;
    readonly MAX_SIZE_WIDTH_SCREEN = 750 * 2;
    readonly MAX_SIZE_HEIGHT_SCREEN = 1624 * 2;
    readonly MIN_SIZE_WIDTH_SCREEN = 375 * 2;
    readonly MIN_SIZE_HEIGHT_SCREEN = 812 * 2;

    public buttonStates: Record<string, boolean> = {
        leftPress: false,
        rightPress: false,
        upPress: false,
        downPress: false,
        phonePressed: false
    }

    get gameStateManager(): GameStateManager {
        return this._gameStateManager;
    }

    get storyManager(): StoryManager {
        return this._storyManager;
    }

    get masterSceneController(): MasterSceneController {
        return this._masterSceneController;
    }

    get chatSceneController(): ChatSceneController {
        return this._chatSceneController;
    }

    get popupSceneController(): PopupSceneController {
        return this._popupSceneController;
    }

    get acheivementManager(): AchievementManager {
        return this._acheivementManager;
    }

    get apiHelper(): ApiHelper {
        return this._apiHelper;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get hatManager(): HatManager {
        return this._hatManager;
    }

    get chapterManager(): ChapterManager {
        return this._chapterManager;
    }

    get docSceneController(): DocSceneController {
        return this._docSceneController;
    }

    get menuSceneController(): MenuSceneController {
        return this._menuSceneController;
    }

    get roomSceneController(): RoomSceneController {
        return this._roomSceneController;
    }

    get taskManager(): TaskManager {
        return this._taskManager;
    }

    get questionSceneController(): QuestionSceneController {
        return this._questionSceneController;
    }

    get worldSceneController(): WorldSceneController {
        return this._worldSceneController;
    }

    constructor() {

        this.configureGame();
        this._game = new Phaser.Game(this._gameConfig);

    }

    initManagersAndHelpers(){
        this._gameStateManager = new GameStateManager();
        this._storyManager = new StoryManager();
        this._acheivementManager = new AchievementManager();
        this._hatManager = new HatManager();
        this._chapterManager = new ChapterManager();
        this._taskManager = new TaskManager();

        this._apiHelper = new ApiHelper();

        this._masterSceneController = new MasterSceneController();
    }

    initSceneControllers(){
        this._chatSceneController = new ChatSceneController(this._masterSceneController);
        this._popupSceneController = new PopupSceneController(this._masterSceneController);
        this._docSceneController = new DocSceneController(this._masterSceneController);
        this._menuSceneController = new MenuSceneController(this._masterSceneController);
        this._roomSceneController = new RoomSceneController(this._masterSceneController);
        this._questionSceneController = new QuestionSceneController(this._masterSceneController);
        this._worldSceneController = new WorldSceneController(this._masterSceneController, this._roomSceneController);

        this._eventBusController = new EventBusController(this._popupSceneController,this._worldSceneController,this._gameStateManager,this._apiHelper);
    }

    startGame(userData:any) {
        this.apiHelper.getStateData().then((data:any) => {
            if(data.state_data){
                this.gameStateManager.initialiseExisting(data.state_data);
            }
            if(userData){
                this.user = new User(userData);
            }else{
                this.user = new User();
            }
            //Preload scene is not tracked by masterSceneController
            // this.startScene(SceneKeys.PRELOAD_SCENE_KEY, { worldViewScene: this.worldViewScene });
            this.startScene(SceneKeys.PRELOAD_SCENE_KEY);
        }).catch((error) => console.error(error));
    }

    initialWorldViewStart(){
        this.initSceneControllers();
        if(this.gameStateManager.gameFinished){
            this._worldSceneController.startEvaluationScene();
        }else{
            this._worldSceneController.addWorldViewScenes();
            this._worldSceneController.startWorldViewScenes();
        }
    }

    private configureGame() {
        this._gameConfig = {
            type: Phaser.WEBGL,
            width: 375,
            height: 812,
            pixelArt: true,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: {y: 0},
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
            // scene: new WorldViewScene(),
            // scene: new LoginScene(),
            scene: [LoginScene, PreloadScene],
            // scene: new ChatViewScene(),
            parent: "game",
            dom: {
                createContainer: true
            },
            backgroundColor: "#000000",
            plugins: {
                global: [
                    // { key: 'SceneWatcher', plugin: SceneWatcherPlugin, start: true }
                ]
            },
        };
    }

    addScene(key: string, scene: Phaser.Scene) {
        this._game.scene.add(key, scene);
    }

    startScene(key: string | Phaser.Scene, data?: object) {
        this._game.scene.start(key);
    }

    stopScene(key: string | Phaser.Scene) {
        this._game.scene.stop(key);
    }

    sleepScene(key: string | Phaser.Scene) {
        this._game.scene.sleep(key);
    }

    wakeScene(key: string | Phaser.Scene) {
        this._game.scene.wake(key);
    }

    removeScene(key: string) {
        this._game.scene.remove(key)
    }
}

// Initialize GameController and start the game
export const gameController = new GameController();
gameController.initManagersAndHelpers();
