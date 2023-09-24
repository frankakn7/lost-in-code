import TextViewScene from "../scenes/docView/textViewScene";
import MasterSceneController from "./masterSceneController";
import {SceneKeys} from "../types/sceneKeys";

export default class DocSceneController {

    private _textViewScene: TextViewScene;

    private _masterSceneController: MasterSceneController;

    constructor(masterSceneController: MasterSceneController) {
        this._masterSceneController = masterSceneController;
    }

    openTextViewScene(textToShow) {
        this._textViewScene = new TextViewScene(textToShow)
        this._masterSceneController.addScene(SceneKeys.TEXT_VIEW_SCENE_KEY,this._textViewScene)
        this._masterSceneController.sleepAllScenes();
        this._masterSceneController.startScene(SceneKeys.TEXT_VIEW_SCENE_KEY)
    }

    backToDocView(){
        this._masterSceneController.sleepAllScenes();
        this._masterSceneController.wakeScene(SceneKeys.DOC_VIEW_SCENE_KEY)
    }
}