import * as Phaser from "phaser";
import RoomScene from "../classes/room";
import ControlPadScene from "../ui/ControlPadScene";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatView from "./chatView";
import {ChatFlowNode} from "../classes/chat/chatFlowNode";
import ChatFlow from "../classes/chat/chatFlow";
import QuestionView from "./questionView/questionView";
import TaskManager from "../managers/taskManager";
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
import MenuView from "./menuView";
import StoryManager from "../managers/story_management/storyManager";

import strawHatTexture from "../assets/hats/strawHat.png";
import sorcerersHatTexture from "../assets/hats/redHat.png";
import truckerCapTexture from "../assets/hats/truckerCap.png"
import blackHatTexture from "../assets/hats/blackHat.png";
import sombreroTexture from "../assets/hats/sombrero.png";
import propellerHatTexture from "../assets/hats/propellerHat.png";
import crownTexture from "../assets/hats/crown.png";
import pirateHat from "../assets/hats/pirateHat.png";
import hatBg from "../assets/hats/hatBg.png";
import hatBgSelected from "../assets/hats/hatBgSelected.png";
import {HatMap} from "../constants/hats";
import HatView from "./hatView";

import tilesetPng from "../assets/tileset/station_tilemap.png";
import tilemapJson from "../tilemaps/engineRoom.json";
import {TilemapConfig} from "../types/tilemapConfig";

import commonRoomJson from "../assets/tilemaps/common.json";
import bridgeJson from "../assets/tilemaps/bridge.json";
import engineJson from "../assets/tilemaps/engine.json";
import hangarJson from "../assets/tilemaps/hangar.json";
import labJson from "../assets/tilemaps/laboratory.json";

import flaresJson from "../assets/particles/flares.json";
import flaresPng from "../assets/particles/flares.png";
import {GamestateType} from "../types/gamestateType";
import {globalEventBus} from "../helpers/globalEventBus";
import ApiHelper from "../helpers/apiHelper";
import ChapterManager, {ChapterType} from "../managers/chapterManager";
import DocView from "./docView/docView";
import ReturnButtonTexture from "../assets/ui/Return-Button.png";
import NewsPopup from "../ui/newsPopup";
import AchievementManager from "../managers/achievementManager";
import {achievements} from "../constants/achievements";

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

import ProgressBar from "../ui/progress";
import User from "../classes/user";
import EvaluationView from "./evaluationView";



/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class RootNode extends Phaser.Scene {
    private roomMap = new Map<string, RoomScene>;

    // Empty State for testing purposes
    private _state: GamestateType = {
        rootNode: {
            currentRoom: "hangar",
            gameFinished: false
        },
        room: {
            finishedTaskObjects: [
                false, false, false, false
            ],
        },
        story: {
            hangar: [],
            commonRoom: [],
            engine: [],
            laboratory: [],
            bridge: [],
            history: []
        },
        user: {
            answeredQuestionIds: [],
            chapterNumber: 1,
            repairedObjectsThisChapter: 0,
            performanceIndex: 1,
            unlockedHats: [],
            selectedHat: "None",
            newChapter: true,
        },
        achievements: {
            taskCounter: 0,
            incorrectCounter: 0,
            currentStreak: 0,
            longestStreak: 0,
            fastestTaskTime: 0,
            unlocked: []
        }
    };


    private _gameFinished = false; // Indicates whether the game has been finished or not.


    private currentRoom: RoomScene; // The currently displayed room.

    private _startingRoomId: string = "hangar"; // The ID of the default starting room.

    private controlPad = new ControlPadScene(); // The control pad scene for handling player movement.


    private pauseChatButtons = new PauseChatButtons(); // The pause chat buttons scene for handling pausing and resuming chat.
    private progressBar = new ProgressBar(this); // The progress bar scene for displaying the progress of the game.

    public achievementManager: AchievementManager = new AchievementManager(this); // The achievement manager for handling achievements.


    private storyChatView: ChatView; // The chat view scene for handling chat.


    private questionView: Phaser.Scene; // The question view scene for handling questions.

    public menuView = new MenuView(this); // The menu view scene for handling the menu.

    private taskManager: TaskManager; // The task manager for handling tasks.

    private _storyManager: StoryManager; // The story manager for handling the story.

    public hatMap = HatMap; // The hat map for storing hat data.

    public hatView: HatView; // The hat view scene for handling hats.

    private taskQueue: Array<() => void> = [];

    private _news = []; // The news popups that are currently displayed.
    private _newsCounter = 0; // The counter for the news popups.

    private apiHelper = new ApiHelper(); // The API helper for handling API calls.

    public docView: DocView; // The documentation view scene for handling documentation.

    private _user: User; // The user instance for storing user data.


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
            this.storyChatView = new ChatView(this, null,this._state.story.history, "StoryChatView");
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
            this.storyChatView.startNewChatFlow(this._storyManager.pullNextStoryBit(this.currentRoom.getRoomId()));
            this.scene.wake(this.storyChatView);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this.storyChatView = new ChatView(this, this._storyManager.pullNextStoryBit(this.currentRoom.getRoomId()),this._state.story.history, "StoryChatView");
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
    public openEventChatView(roomId, eventId) : void {
        let cf = this._storyManager.pullEventIdChatFlow(roomId, eventId);

        if (this.scene.isSleeping(this.storyChatView)) {
            this.storyChatView.startNewChatFlow(cf);
            this.scene.wake(this.storyChatView);
        }
        else {
            this.storyChatView = new ChatView(this, cf, this._state.story.history, "StoryChatView");
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
    public openTextChatView(text,customExitFunction:Function): void {
        this.prepSceneForChat();

        const simpleChatNode: ChatFlowNode = {text: text, optionText: "Start", choices: new Map<string, ChatFlowNode>}

        const simpleChatFlow = new ChatFlow(simpleChatNode)

        const textChatView = new ChatView(this, simpleChatFlow, [],"ChatTextView", true,customExitFunction)

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
        let newsPopup = new NewsPopup(this, newsId,message, 2500);
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
        let newsPopup = new NewsPopup(this, newsId,achievement.text, 2500, achievement.texture);
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
     * Opens the QuestionView or TextChatView based on certain conditions.
     * If the user is not in a new chapter, the QuestionView is opened. Otherwise,
     * the TextChatView with the chapter material is displayed, and then the QuestionView is opened.
     */
    private openQuestionView(){
        //If the chat view already exists and is sleeping
        if (!this._user.newChapter) {

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
                this.questionView = new QuestionView(this.taskManager);
                //add question view to the scene
                this.scene.add("questionView", this.questionView);
                //launch the question view
                this.scene.launch(this.questionView);
            }
        } else {
            this._user.newChapter = false
            this.docView.chapterManager.updateChapters().then((chapters: ChapterType[]) => {
                this.openTextChatView(chapters.find(chapter => chapter.order_position == this._user.chapterNumber).material,() => {
                    this.scene.remove("ChatTextView");
                    if (this.scene.isSleeping(this.questionView)) {
                        this.scene.wake(this.questionView);
                        //If the chat view hasn't been launched yet
                        // } else if(this.scene.isActive(this.questionView)){
                        //     console.log(this.scene.isActive(this.questionView))
                        //     return;
                    } else {
                        //create a new question view
                        this.questionView = new QuestionView(this.taskManager);
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
     * Preloads the required assets for the game.
     */
    public preload() {
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
        // this.load.image("returnButtonTexture", ReturnButtonTexture);

    }

    /**
     * Constructs the RootNode scene, responsible for setting up the entire game.
     * @param {any} userData - Data related to the user, such as ID and username.
     * @param {GamestateType} state - The state of the game, indicating the progress and data of the user's playthrough.
     */
    constructor(
        userData?: any,
        state?: GamestateType,
    ) {
        super("Play");

        // If the state parameter is provided, set it as the current state of the game.
        // If not provided, the default state will be used.
        state ? this._state = state : null;

        console.log(this._state)
        // Create a new User instance with the provided user data if available, otherwise create a new User with default data.
        this._user = userData ? new User(userData.id, userData.username, this._state.user) : new User();

        // Create and set up the various RoomScene instances for different rooms in the game.
        // Each RoomScene represents a specific room in the game with its tilemap, layers, and player position.
        this.roomMap.set("hangar", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: hangarJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "hangar", this).setNextRoom("commonRoom").setPlayerPosition(32 * 12, 32 * 3));
        this.roomMap.set("commonRoom", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: commonRoomJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "commonRoom", this).setNextRoom("engine").setPlayerPosition(32 * 2, 32 * 10));
        this.roomMap.set("engine", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: engineJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "engine", this).setNextRoom("laboratory").setPlayerPosition(32 * 2, 32 * 10));
        this.roomMap.set("laboratory", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: labJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "laboratory", this).setNextRoom("bridge").setPlayerPosition(32 * 2, 32 * 10));
        this.roomMap.set("bridge", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: bridgeJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "bridge", this).setPlayerPosition(32 * 2, 32 * 10));

        // Load the required data for the game.
        this.loadData();
        this.hatView = new HatView(this)
        this._storyManager = new StoryManager(this)
        this.taskManager = new TaskManager(this)


        // Set the current room to be the starting room specified by the startingRoomId.
        this.currentRoom = this.roomMap.get(this._startingRoomId);

        this.questionView = new QuestionView(this.taskManager);
    }

    /**
     * Get the currently displayed room
     * @returns the {@link currentRoom}
     */
    public getCurrentRoom(): RoomScene {
        return this.currentRoom;
    }

    /**
     * Navigates the player to a new room in the game based on the provided room ID.
     * @param {string} id - The ID of the room to navigate to.
     */
    public getToRoomViaId(id: string) {
        let nextRoom = this.roomMap.get(id);
        this.scene.stop(this.currentRoom)

        // Initialize the 'finishedTaskObjects' property of the game state for the next room.
        // The 'finishedTaskObjects' property is an array that tracks the completion status of tasks in the room.
        // It is set to an array of false values with the length equal to the number of task objects in the next room.
        this._state.room.finishedTaskObjects = Array(nextRoom.getTaskObjectCount()).fill(false);

        // Launch the next room scene to activate it.
        this.scene.launch(this.roomMap.get(id));

        this.currentRoom = nextRoom;

    }

    /**
     * Initializes the RootNode scene and sets up various components of the game.
     * Called during the scene's creation and initialization.
     */
    public create() {
        // Set up event listeners for wake and sleep events of the RootNode scene.
        this.events.on('wake', this.onWake, this);
        this.events.on('sleep', () => {
            console.log("SLEEPING PLAY VIEW")
        })

        // Set up event listener to save the game state when 'save_game' event is emitted.
        globalEventBus.on("save_game", () => this.apiHelper.updateStateData(this.saveAllToGamestateType()).
        catch((error) => {
            console.error(error);
        }))

        // Create and initialize the DocView instance for handling documentation view.
        this.docView = new DocView(this, this._state.user.chapterNumber);

        // Add each RoomScene to the game as a separate scene using the roomMap.
        this.roomMap.forEach((value, key) => {
            this.scene.add(key, this.roomMap.get(key));
        })



        //Adds the pause button scene and launches it
        this.scene.add("pauseChatButtons", this.pauseChatButtons);
        this.scene.launch(this.pauseChatButtons);

        // Adds the progress bar scene and launches it.
        this.scene.add("Progress Bar", this.progressBar);
        this.scene.launch(this.progressBar);

        // Adds the controlpad scene and launches it
        this.scene.add("controlPad", this.controlPad);
        this.scene.launch(this.controlPad);

        // Adds the menu scene.
        this.scene.add("menu", this.menuView);

        // Set up event listeners to handle broadcasting news and achievements.
        this.broadcastNews = this.broadcastNews.bind(this);
        globalEventBus.on("broadcast_news", (message) => {this.broadcastNews(message)})
        this.broadcastAchievement = this.broadcastAchievement.bind(this);
        globalEventBus.on("broadcast_achievement", (achievement) => {this.broadcastAchievement(achievement)});

        // Set up an event listener for the 'game_finished' event to handle the game completion.
        globalEventBus.once("game_finished", (() => {
            this._gameFinished = true;
            globalEventBus.emit("save_game");
        }).bind(this))

        // Set up an event listener for the 'chat_closed' event to open the evaluation view when the game is finished.
        globalEventBus.on("chat_closed", (() => {
            if (this._gameFinished) {
                let evalView = new EvaluationView(this, this.achievementManager);
                this.scene.add("EvaluationView", evalView);
                this.scene.launch(evalView)
            }
        }).bind(this));

        // Check if the game is already finished and launch the EvaluationView if necessary.
        if (this._gameFinished) {
            let evalView = new EvaluationView(this, this.achievementManager);
            this.scene.add("EvaluationView", evalView);
            this.scene.launch(evalView);
        } else{
            this.scene.launch(this.currentRoom);
        }

    }


    /**
     * Update function called every frame during the game loop.
     * @param time - The current game time in milliseconds.
     * @param delta - The time elapsed since the last frame in milliseconds.
     */
    public update(time: number, delta: number): void {
        // Update the current room's player movement based on control pad input.
        if (this.currentRoom.player) {
            this.currentRoom.player.leftPress = this.controlPad.leftPress
            this.currentRoom.player.rightPress = this.controlPad.rightPress
            this.currentRoom.player.upPress = this.controlPad.upPress
            this.currentRoom.player.downPress = this.controlPad.downPress
            this.currentRoom.player.interactPress = this.controlPad.interactPress

        }
        // if(this.controlPad.leftPress){
        //     // console.log("left")
        // }
        // if(this.controlPad.rightPress){
        //     console.log("right")
        //     this.currentRoom.player.rightPress = true
        // }
        // if(this.controlPad.upPress){
        //     console.log("up")
        //     this.currentRoom.player.upEPress = true
        // }
        // if(this.controlPad.downPress){
        //     console.log("down")
        //     this.currentRoom.player.downPress
        // }
        // if(this.controlPad.interactPress){
        //     // console.log("interact")
        //     globalEventBus.emit("save_game")
        // }


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
     * Loads the game data from the game state.
     */
    public loadData() {
        if (this._state.rootNode.currentRoom)
            this._startingRoomId = this._state.rootNode.currentRoom
        this._gameFinished = this._state.rootNode.gameFinished;
    }


    /**
     * Pauses or resumes the game by pausing or resuming the current room and the control pad.
     * @param pause
     */
    public pauseOrResumeGame: Function = (pause) => {
        if (pause) {
            this.currentRoom.scene.pause();
            this.controlPad.scene.pause();
        } else {
            this.currentRoom.scene.resume();
            this.controlPad.scene.resume();
        }
    }

    /**
     * Saves the game state to a GamestateType object.
     */
    public saveAllToGamestateType(): GamestateType {
        return {
            rootNode: {
                currentRoom: this.getCurrentRoom().getRoomId(),
                gameFinished: this._gameFinished
            },
            room: this.getCurrentRoom().saveAll(),
            story: this._storyManager.saveAll(),
            user: this.user.saveState(),
            achievements: this.achievementManager.saveAll()
        };
    }

    /**
     * Returns the current game state.
     */
    public getState() {
        return this._state;
    }

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
