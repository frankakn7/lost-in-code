import {SceneKeys} from "../types/sceneKeys";
import EvaluationViewScene from "../scenes/evaluationViewScene";
import MasterSceneController from "./masterSceneController";
import WorldViewScene from "../scenes/worldViewScene";
import UiScene from "../scenes/uiScene";
import RoomSceneController from "./roomSceneController";

export default class WorldSceneController {

    private _masterSceneController: MasterSceneController;
    private _roomSceneController: RoomSceneController;

    private _evaluationViewScene: EvaluationViewScene;
    private _worldViewScene: WorldViewScene;
    private _uiScene: UiScene;


    constructor(masterSceneController: MasterSceneController, roomSceneController: RoomSceneController) {
        this._masterSceneController = masterSceneController;
        this._roomSceneController = roomSceneController;

        this._evaluationViewScene = new EvaluationViewScene();
        this._worldViewScene = new WorldViewScene();
        this._uiScene = new UiScene();
    }

    addWorldViewScenes(){
        this._masterSceneController.addScene(SceneKeys.WORLD_VIEW_SCENE_KEY, this._worldViewScene)
        this._masterSceneController.addScene(SceneKeys.UI_SCENE_KEY, this._uiScene)
    }

    sleepWorldViewScenes(){
        this._masterSceneController.sleepScene(SceneKeys.WORLD_VIEW_SCENE_KEY);
        this._masterSceneController.sleepScene(SceneKeys.UI_SCENE_KEY);
    }

    resumeWorldViewScenes(){
        this._masterSceneController.sleepAllScenes();
        this._masterSceneController.wakeScene(SceneKeys.WORLD_VIEW_SCENE_KEY);
        this._roomSceneController.wakeCurrentRoomScene();
        this._masterSceneController.wakeScene(SceneKeys.UI_SCENE_KEY);
    }

    startWorldViewScenes(){
        this._masterSceneController.startScene(SceneKeys.WORLD_VIEW_SCENE_KEY);
        this._masterSceneController.startScene(SceneKeys.UI_SCENE_KEY)
    }

    startEvaluationScene(){
        this._masterSceneController.addScene(SceneKeys.EVALUATION_VIEW_SCENE_KEY,this._evaluationViewScene);
        this._masterSceneController.startScene(SceneKeys.EVALUATION_VIEW_SCENE_KEY);
    }
}