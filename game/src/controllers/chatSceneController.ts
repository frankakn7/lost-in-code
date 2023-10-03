import Phaser from "phaser";
import {ChatFlowNode} from "../classes/chat/chatFlowNode";
import ChatFlow from "../classes/chat/chatFlow";
import ChatViewScene from "../scenes/chatViewScene";
import MasterSceneController from "./masterSceneController";
import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";

export default class ChatSceneController {

    private _masterSceneController: MasterSceneController;
    private _storyChatView: ChatViewScene;

    constructor(masterSceneController: MasterSceneController) {
        this._masterSceneController = masterSceneController;
    }


    /**
     * Opens the story chat view without removing the story chat node from the story manager.
     * If the chat view is already open, it wakes it up; otherwise, it creates a new chat view.
     * The method also sleeps other scenes such as controlPad, pauseChatButtons, and Room for a smooth transition.
     */
    public openStoryChatViewWithoutPulling() {
        // Sleep other scenes for a smooth transition
        this._masterSceneController.prepScenesForChat()

        // Check if the story chat view is already open
        if (!this._masterSceneController.isSceneSleeping(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY)) {
            // Create a new chat view with the history from _state.story
            this._storyChatView = new ChatViewScene(null, gameController.gameStateManager.story.history, SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
            //add chat view to the scene
            this._masterSceneController.addScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY, this._storyChatView);
            //start the chat view
        }
        this._masterSceneController.runScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
    }

    /**
     * Opens the chat view by sending all other scenes to sleep and launching / awaking the chat view scene
     */
    public openStoryChatView(): void {

        this._masterSceneController.prepScenesForChat()

        let newChatFlow = gameController.storyManager.pullNextStoryBit(gameController.gameStateManager.room.id);

        //If the chat view already exists and is sleeping
        if (this._masterSceneController.isSceneSleeping(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY)) {
            //start a new chat flow and awake the scene
            this._storyChatView.startNewChatFlow(newChatFlow);
            // this._masterSceneController.wakeScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this._storyChatView = new ChatViewScene(newChatFlow, gameController.gameStateManager.story.history, SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
            //add chat view to the scene
            this._masterSceneController.addScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY, this._storyChatView);
            //launch the chat view
        }
            this._masterSceneController.runScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
    }

    /**
     * Opens the story chat view, either by waking up an existing sleeping chat view
     * or by creating and launching a new chat view with the first chat flow.
     */
    public openEventChatView(roomId, eventId): void {

        this._masterSceneController.prepScenesForChat()

        let eventChatFlow = gameController.storyManager.pullEventIdChatFlow(roomId, eventId);

        if (this._masterSceneController.isSceneSleeping(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY)) {
            this._storyChatView.startNewChatFlow(eventChatFlow);
            // this._masterSceneController.wakeScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
        } else {
            this._storyChatView = new ChatViewScene(eventChatFlow, gameController.gameStateManager.story.history, SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
            this._masterSceneController.addScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY, this._storyChatView);
            //launch the chat view
        }
        this._masterSceneController.runScene(SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);
    }

    /**
     * Opens a text-based chat view with the provided text and custom exit function.
     * @param {string} text - The text to be displayed in the chat view.
     * @param {Function} customExitFunction - A custom function to be executed when the chat view is exited.
     */
    public openTextChatView(text: string, customExitFunction: Function): void {

        this._masterSceneController.prepScenesForChat()

        const simpleChatNode: ChatFlowNode = {text: text, optionText: "Start", choices: new Map<string, ChatFlowNode>}

        const simpleChatFlow: ChatFlow = new ChatFlow(simpleChatNode)

        const textChatView: ChatViewScene = new ChatViewScene(simpleChatFlow, [], SceneKeys.SINGLE_TEXT_CHAT_VIEW_SCENE_KEY, true, customExitFunction)

        // this._masterSceneController.addScene("ChatTextView", textChatView)
        this._masterSceneController.addScene(SceneKeys.SINGLE_TEXT_CHAT_VIEW_SCENE_KEY, textChatView)
        this._masterSceneController.runScene(SceneKeys.SINGLE_TEXT_CHAT_VIEW_SCENE_KEY)
    }

    public removeTextChatView(){
        this._masterSceneController.removeScene(SceneKeys.SINGLE_TEXT_CHAT_VIEW_SCENE_KEY)
    }

    public exitChat(sceneKey: SceneKeys,destroyOnExit: boolean){
        if(!destroyOnExit){
            this._masterSceneController.sleepScene(sceneKey)
        }else{
            this._masterSceneController.removeScene(sceneKey)
        }
    }
}