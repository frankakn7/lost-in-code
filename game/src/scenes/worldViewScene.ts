import * as Phaser from "phaser";
import RoomScene from "../classes/room";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatViewScene from "./chatViewScene";
import {ChatFlowNode} from "../classes/chat/chatFlowNode";
import ChatFlow from "../classes/chat/chatFlow";
import QuestionViewScene from "./questionView/questionViewScene";
import TaskManager from "../managers/taskManager";

import MenuViewScene from "./menuViewScene";
import StoryManager from "../managers/story_management/storyManager";

import {HatMap} from "../constants/hats";
import HatViewScene from "./hatViewScene";

import tilesetPng from "../assets/tileset/station_tilemap.png";

import commonRoomJson from "../assets/tilemaps/common.json";
import bridgeJson from "../assets/tilemaps/bridge.json";
import engineJson from "../assets/tilemaps/engine.json";
import hangarJson from "../assets/tilemaps/hangar.json";
import labJson from "../assets/tilemaps/laboratory.json";

import {GameStateType} from "../types/gameStateType";
import {globalEventBus} from "../helpers/globalEventBus";
import ApiHelper from "../helpers/apiHelper";
import ChapterManager, {ChapterType} from "../managers/chapterManager";
import DocViewScene from "./docView/docViewScene";

import NewsPopup from "../ui/newsPopup";
import AchievementManager from "../managers/achievementManager";
import {achievements} from "../constants/achievements";

import ProgressBar from "../ui/progress";
import User from "../classes/user";
import EvaluationViewScene from "./evaluationViewScene";
// import {GameStateManager} from "../managers/gameStateManager";
import {UserType} from "../types/userType";
import RoomSceneController from "../controllers/roomSceneController";

import {gameController} from "../main";
import ControlPadGroup from "../ui/controlPadGroup";
import UiScene from "./uiScene";


/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class WorldViewScene extends Phaser.Scene {
    // private gameController.gameStateManager = new GameStateManager();

    private pauseChatButtons = new PauseChatButtons(); // The pause chat buttons scene for handling pausing and resuming chat.
    private progressBar = new ProgressBar(this); // The progress bar scene for displaying the progress of the game.

    public achievementManager: AchievementManager = new AchievementManager(this); // The achievement manager for handling achievements.

    private storyChatView: ChatViewScene; // The chat view scene for handling chat.

    private questionView: Phaser.Scene; // The question view scene for handling questions.

    public menuView = new MenuViewScene(this); // The menu view scene for handling the menu.

    private taskManager: TaskManager; // The task manager for handling tasks.

    private _storyManager: StoryManager; // The story manager for handling the story.

    public hatMap = HatMap; // The hat map for storing hat data.

    public hatView: HatViewScene; // The hat view scene for handling hats.

    private taskQueue: Array<() => void> = [];

    private _news = []; // The news popups that are currently displayed.
    private _newsCounter = 0; // The counter for the news popups.

    private apiHelper = new ApiHelper(); // The API helper for handling API calls.

    public docView: DocViewScene; // The documentation view scene for handling documentation.

    private _user: User; // The user instance for storing user data.

    private _roomSceneController: RoomSceneController;

    private uiScene = new UiScene();


    /**
     * Opens the story chat view without removing the story chat node from the story manager.
     * If the chat view is already open, it wakes it up; otherwise, it creates a new chat view.
     * The method also sleeps other scenes such as controlPad, pauseChatButtons, and Room for a smooth transition.
     */
    public openStoryChatViewWithoutPulling() {
        // Sleep other scenes for a smooth transition
        this.scene.sleep();
        this.scene.sleep("controlPad");
        this.scene.sleep("pauseChatButtons");
        this.scene.sleep("Room");
        // this.scene.wake(this.storyChatView);

        // Check if the story chat view is already open
        if (this.scene.isSleeping(this.storyChatView)) {
            this.scene.wake(this.storyChatView);
        } else {
            // Create a new chat view with the history from _state.story
            this.storyChatView = new ChatViewScene(this, null, gameController.gameStateManager.story.history, "StoryChatView");
            //add chat view to the scene
            this.scene.add("StoryChatView", this.storyChatView);
            //launch the chat view
            this.scene.launch(this.storyChatView);
        }
    }

    /**
     * Opens the chat view by sending all other scenes to sleep and launching / awaking the chat view scene
     */
    public openStoryChatView(): void {
        this.prepSceneForChat();

        //If the chat view already exists and is sleeping
        if (this.scene.isSleeping(this.storyChatView)) {
            //start a new chat flow and awake the scene
            this.storyChatView.startNewChatFlow(this._storyManager.pullNextStoryBit(this._roomSceneController.currentRoomScene.getRoomId()));
            this.scene.wake(this.storyChatView);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this.storyChatView = new ChatViewScene(this, this._storyManager.pullNextStoryBit(this._roomSceneController.currentRoomScene.getRoomId()), gameController.gameStateManager.story.history, "StoryChatView");
            //add chat view to the scene
            this.scene.add("StoryChatView", this.storyChatView);
            //launch the chat view
            this.scene.launch(this.storyChatView);
        }
    }

    /**
     * Opens the story chat view, either by waking up an existing sleeping chat view
     * or by creating and launching a new chat view with the first chat flow.
     */
    public openEventChatView(roomId, eventId): void {
        let cf = this._storyManager.pullEventIdChatFlow(roomId, eventId);

        if (this.scene.isSleeping(this.storyChatView)) {
            this.storyChatView.startNewChatFlow(cf);
            this.scene.wake(this.storyChatView);
        } else {
            this.storyChatView = new ChatViewScene(this, cf, gameController.gameStateManager.story.history, "StoryChatView");
            this.scene.add("StoryChatView", this.storyChatView);
            //launch the chat view
            this.scene.launch(this.storyChatView);
        }
    }

    /**
     * Opens a text-based chat view with the provided text and custom exit function.
     * @param {string} text - The text to be displayed in the chat view.
     * @param {Function} customExitFunction - A custom function to be executed when the chat view is exited.
     */
    public openTextChatView(text, customExitFunction: Function): void {
        this.prepSceneForChat();

        const simpleChatNode: ChatFlowNode = {text: text, optionText: "Start", choices: new Map<string, ChatFlowNode>}

        const simpleChatFlow = new ChatFlow(simpleChatNode)

        const textChatView = new ChatViewScene(this, simpleChatFlow, [], "ChatTextView", true, customExitFunction)

        this.scene.add("ChatTextView", textChatView)
        this.scene.launch(textChatView)
    }

    /**
     * Prepares the scene for displaying a chat view by putting other scenes to sleep.
     * This ensures that only the chat view is active and visible.
     */
    public prepSceneForChat() {
        this.scene.sleep();
        this.scene.sleep("controlPad");
        this.scene.sleep("pauseChatButtons");
        this.scene.sleep("Room");
    }

    /**
     * Called when the scene is woken up from being paused.
     * Processes tasks in the task queue, executing them one by one.
     */
    onWake() {
        // Execute all tasks in the queue
        while (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            if (task) {
                task();
            }
        }
    }

    queueTask(task: () => void) {
        this.taskQueue.push(task);
    }


    /**
     * Broadcasts a news message to the player.
     * Creates and displays a new NewsPopup with the given message.
     * If there are existing news popups, they will be removed before showing the new one.
     * @param {string} message - The news message to be displayed in the popup.
     */
    public broadcastNews(message) {
        let newsId = "newsPopup" + (this._newsCounter++).toString();
        let newsPopup = new NewsPopup(this, newsId, message, 2500);
        this.scene.add(newsId, newsPopup);
        this.scene.launch(newsPopup);

        if (this._news.length > 0) {
            this._news.forEach((n) => {
                n.kill();
            })
        }
        this._news.push(newsPopup)
    }

    /**
     * Broadcasts an achievement popup with the given achievement information.
     * @param {object} achievement - The achievement object containing information about the achievement.
     * @param {string} achievement.text - The text message to be displayed in the achievement popup.
     * @param {string} achievement.texture - The texture key for the icon/image associated with the achievement.
     */
    public broadcastAchievement(achievement) {
        let newsId = "newsPopup" + (this._newsCounter++).toString();
        let newsPopup = new NewsPopup(this, newsId, achievement.text, 2500, achievement.texture);
        this.scene.add(newsId, newsPopup);
        this.scene.launch(newsPopup);

        if (this._news.length > 0) {
            this._news.forEach((n) => {
                n.kill();
            })
        }
        this._news.push(newsPopup)
    }

    /**
     * Opens the QuestionViewScene or TextChatView based on certain conditions.
     * If the user is not in a new chapter, the QuestionViewScene is opened. Otherwise,
     * the TextChatView with the chapter material is displayed, and then the QuestionViewScene is opened.
     */
    private openQuestionView() {
        //If the chat view already exists and is sleeping
        if (!gameController.gameStateManager.user.newChapter) {

            this.scene.sleep(this);
            this.scene.sleep("controlPad");
            this.scene.sleep("pauseChatButtons");
            this.scene.sleep("Room");
            if (this.scene.isSleeping(this.questionView)) {
                this.scene.wake(this.questionView);
                //If the chat view hasn't been launched yet
                // } else if(this.scene.isActive(this.questionView)){
                //     console.log(this.scene.isActive(this.questionView))
                //     return;
            } else {
                //create a new question view
                this.questionView = new QuestionViewScene(this.taskManager);
                //add question view to the scene
                this.scene.add("questionView", this.questionView);
                //launch the question view
                this.scene.launch(this.questionView);
            }
        } else {
            gameController.gameStateManager.user.newChapter = false
            this.docView.chapterManager.updateChapters().then((chapters: ChapterType[]) => {
                this.openTextChatView(chapters.find(chapter => chapter.order_position == gameController.gameStateManager.user.chapterNumber).material, () => {
                    this.scene.remove("ChatTextView");
                    if (this.scene.isSleeping(this.questionView)) {
                        this.scene.wake(this.questionView);
                        //If the chat view hasn't been launched yet
                        // } else if(this.scene.isActive(this.questionView)){
                        //     console.log(this.scene.isActive(this.questionView))
                        //     return;
                    } else {
                        //create a new question view
                        this.questionView = new QuestionViewScene(this.taskManager);
                        //add question view to the scene
                        this.scene.add("questionView", this.questionView);
                        //launch the question view
                        this.scene.launch(this.questionView);
                    }
                })
            });
        }
    }

    /**
     * Constructs the WorldViewScene scene, responsible for setting up the entire game.
     * @param {any} userData - Data related to the user, such as ID and username.
     * @param {GameStateType} state - The state of the game, indicating the progress and data of the user's playthrough.
     */
    constructor(
        userData?: UserType,
        state?: GameStateType,
    ) {
        super("worldViewScene");

        state? gameController.gameStateManager.initialiseExisting(state) : null;

        console.log("### LOADED GAME STATE")
        console.log(gameController.gameStateManager);

        // initialise new gameController.gameStateManager

        // Create a new User instance with the provided user data if available, otherwise create a new User with default data.
        this._user = userData ? new User(userData) : new User();

        // Load the required data for the game.
        this.hatView = new HatViewScene(this)
        this._storyManager = new StoryManager(this)
        this.taskManager = new TaskManager(this)

        this.questionView = new QuestionViewScene(this.taskManager);
    }

    /**
     * Initializes the WorldViewScene scene and sets up various components of the game.
     * Called during the scene's creation and initialization.
     */
    public create() {

        this._roomSceneController = new RoomSceneController(this);

        this._roomSceneController.currentRoomScene = this._roomSceneController.roomMap.get(gameController.gameStateManager.currentRoom);
        console.log(this._roomSceneController.currentRoomScene);

        console.log("### CREATING ROOT NODE")
        // Set up event listeners for wake and sleep events of the WorldViewScene scene.
        this.events.on('wake', this.onWake, this);
        this.events.on('sleep', () => {
            console.log("SLEEPING PLAY VIEW")
        })

        // Set up event listener to save the game state when 'save_game' event is emitted.
        globalEventBus.on("save_game", () => this.apiHelper.updateStateData(gameController.gameStateManager).catch((error) => {
            console.error(error);
        }))

        // Create and initialize the DocViewScene instance for handling documentation view.
        this.docView = new DocViewScene(this, gameController.gameStateManager.user.chapterNumber);


        //Adds the pause button scene and launches it
        this.scene.add("pauseChatButtons", this.pauseChatButtons);
        this.scene.launch(this.pauseChatButtons);

        // Adds the progress bar scene and launches it.
        this.scene.add("Progress Bar", this.progressBar);
        this.scene.launch(this.progressBar);

        // Adds the controlpad scene and launches it
        // this.scene.add("controlPad", this.controlPad);
        // this.scene.launch(this.controlPad);
        this.scene.add("uiScene", this.uiScene);
        this.scene.launch(this.uiScene);

        // Adds the menu scene.
        this.scene.add("menu", this.menuView);

        // Set up event listeners to handle broadcasting news and achievements.
        this.broadcastNews = this.broadcastNews.bind(this);
        globalEventBus.on("broadcast_news", (message) => {
            this.broadcastNews(message)
        })
        this.broadcastAchievement = this.broadcastAchievement.bind(this);
        globalEventBus.on("broadcast_achievement", (achievement) => {
            this.broadcastAchievement(achievement)
        });

        // Set up an event listener for the 'game_finished' event to handle the game completion.
        globalEventBus.once("game_finished", (() => {
            gameController.gameStateManager.gameFinished = true;
            globalEventBus.emit("save_game");
        }).bind(this))

        // Set up an event listener for the 'chat_closed' event to open the evaluation view when the game is finished.
        globalEventBus.on("chat_closed", (() => {
            if (gameController.gameStateManager.gameFinished) {
                let evalView = new EvaluationViewScene(this, this.achievementManager);
                this.scene.add("EvaluationView", evalView);
                this.scene.launch(evalView)
            }
        }).bind(this));

        // Check if the game is already finished and launch the EvaluationViewScene if necessary.
        if (gameController.gameStateManager.gameFinished) {
            let evalView = new EvaluationViewScene(this, this.achievementManager);
            this.scene.add("EvaluationView", evalView);
            this.scene.launch(evalView);
        } else {
            this.scene.launch(this._roomSceneController.currentRoomScene);
        }

    }


    /**
     * Update function called every frame during the game loop.
     * @param time - The current game time in milliseconds.
     * @param delta - The time elapsed since the last frame in milliseconds.
     */
    public update(time: number, delta: number): void {

        // Handle phone button press to trigger an achievement.
        if (this.pauseChatButtons.phonePressed) {
            //prevent phone button from being continuously pressed by accident
            this.pauseChatButtons.phonePressed = false;

            // Broadcast the "tasks_5" achievement.
            globalEventBus.emit("broadcast_achievement", achievements["tasks_5"]);
        }

        // Handle pause button press to pause the game and open the menu.
        if (this.pauseChatButtons.pausePressed) {
            this.pauseChatButtons.pausePressed = false;

            // Launch the menu scene and pause the game.
            this.scene.launch(this.menuView);
            this.pauseOrResumeGame(true);
        }

    }

    /**
     * Pauses or resumes the game by pausing or resuming the current room and the control pad.
     * @param pause
     */
    public pauseOrResumeGame: Function = (pause) => {
        //TODO perhaps fix problem with being able to move now in background
        if (pause) {
            this._roomSceneController.currentRoomScene.scene.pause();
            // this.controlPad.scene.pause();
        } else {
            this._roomSceneController.currentRoomScene.scene.resume();
            // this.controlPad.scene.resume();
        }
    }

    /**
     * Saves the game state to a GameStateType object.
     */
    //TODO use the gamestate itself for saving

    // public saveAllToGamestateType(): GameStateType {
    //     return {
    //         currentRoom: this.getCurrentRoom().getRoomId(),
    //         gameFinished: this._gameFinished
    //         room: this.getCurrentRoom().saveAll(),
    //         story: this._storyManager.saveAll(),
    //         user: this.user.saveState(),
    //         achievements: this.achievementManager.saveAll()
    //     };
    // }

    /**
     * Returns the current user.
     */
    get user(): User {
        return this._user;
    }

    /**
     * Returns the current story manager.
     */
    public getStoryManager() {
        return this._storyManager;
    }

    // public checkIfgameStartedForFirstTime() {
    //     if (this.getStoryManager().checkIfEventAvailable("hangar", "event_game_start")) return true;
    //     return false;
    // }
}
