import RoomScene from "../classes/room";
import {gameController} from "../main";
import MasterSceneController from "./masterSceneController";
import {roomMap} from "../constants/roomMap";
import {SceneKeys} from "../types/sceneKeys";

export default class RoomSceneController {

    private _currentRoomScene: RoomScene; // The currently displayed room.

    private _masterSceneController: MasterSceneController;

    constructor(masterSceneController: MasterSceneController) {
        this._masterSceneController = masterSceneController;

        // Add each RoomScene to the game as a separate scene using the roomMap.
        roomMap.forEach((value, key) => {
            this._masterSceneController.addScene(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + key, roomMap.get(key));
        })
        // this._currentRoomScene = gameController.gameStateManager.currentRoomId;
        this.updateCurrentRoomScene();
    }

    get currentRoomScene(): RoomScene {
        return this._currentRoomScene;
    }

    set currentRoomScene(value: RoomScene) {
        this._currentRoomScene = value;
    }

    public wakeCurrentRoomScene(){
        this._masterSceneController.wakeScene(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + this._currentRoomScene.roomId)
    }

    /**
     * Navigates the player to a new room in the game based on the provided room ID.
     * @param {string} id - The ID of the room to navigate to.
     */
    public changeRoomSceneViaId(id: string) {
        console.log("changing room")
        let nextRoom = roomMap.get(id);
        console.log("getting next room")

        // this._currentRoomScene.deleteRoomManager();
        this._masterSceneController.stopScene(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + this._currentRoomScene.roomId)
        // console.log("stopped scene")
        this._masterSceneController.removeScene(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + this._currentRoomScene.roomId);

        // Initialize the 'finishedTaskObjects' property of the game state for the next room.
        gameController.gameStateManager.room.finishedTaskObjects = [];
        // Launch the next room scene to activate it.
        this._masterSceneController.runScene(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + nextRoom.roomId);

        this._currentRoomScene = nextRoom;
    }

    updateCurrentRoomScene(){
        this._currentRoomScene = roomMap.get(gameController.gameStateManager.currentRoomId);
    }
}