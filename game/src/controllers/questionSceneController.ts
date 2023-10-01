import {gameController} from "../main";
import MasterSceneController from "./masterSceneController";
import {SceneKeys} from "../types/sceneKeys";
import QuestionViewScene from "../scenes/questionView/questionViewScene";
import {ChapterType} from "../managers/chapterManager";
import ChoiceQuestionScene from "../scenes/questionView/singleQuestionScenes/choiceQuestionScene";
import InputQuestionScene from "../scenes/questionView/singleQuestionScenes/inputQuestionScene";
import DragDropQuestionScene from "../scenes/questionView/singleQuestionScenes/dragDropQuestionScene";
import ClozeQuestionScene from "../scenes/questionView/singleQuestionScenes/clozeQuestionScene";
import SelectOneQuestionScene from "../scenes/questionView/singleQuestionScenes/selectOneQuestionScene";
import CreateQuestionScene from "../scenes/questionView/singleQuestionScenes/createQuestionScene";

export default class QuestionSceneController {

    private _masterSceneController: MasterSceneController;
    private _questionView: QuestionViewScene;

    constructor(masterSceneController: MasterSceneController) {
        this._masterSceneController = masterSceneController;
    }

    /**
     * Opens the QuestionViewScene or TextChatView based on certain conditions.
     * If the user is not in a new chapter, the QuestionViewScene is opened. Otherwise,
     * the TextChatView with the chapter material is displayed, and then the QuestionViewScene is opened.
     */
    openQuestionView() {
        //If the chat view already exists and is sleeping
        if (!gameController.gameStateManager.user.newChapter) {
            this._masterSceneController.sleepAllScenes();
            if (this._masterSceneController.isSceneSleeping(SceneKeys.QUESTION_VIEW_SCENE_KEY)) {
                this._masterSceneController.wakeScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
            } else {
                //create a new question view
                this._questionView = new QuestionViewScene();
                //add question view to the scene
                gameController.masterSceneController.addScene(SceneKeys.QUESTION_VIEW_SCENE_KEY, this._questionView);
                //launch the question view
                gameController.masterSceneController.runScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
            }
        } else {
            gameController.gameStateManager.user.newChapter = false
            gameController.chapterManager.updateChapters().then((chapters: ChapterType[]) => {
                gameController.chatSceneController.openTextChatView(chapters.find(chapter => chapter.order_position == gameController.gameStateManager.user.chapterNumber).material, () => {
                    gameController.chatSceneController.removeTextChatView();
                    if (this._masterSceneController.isSceneSleeping(SceneKeys.QUESTION_VIEW_SCENE_KEY)) {
                        this._masterSceneController.wakeScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
                    } else {
                        //create a new question view
                        this._questionView = new QuestionViewScene();
                        //add question view to the scene
                        this._masterSceneController.addScene(SceneKeys.QUESTION_VIEW_SCENE_KEY, this._questionView)
                        //launch the question view
                        this._masterSceneController.runScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
                    }
                })
            });
        }
    }

    public addAndStartChoiceQuestionScene(choiceQuestionScene: ChoiceQuestionScene){
        this._masterSceneController.addScene(SceneKeys.CHOICE_QUESTION_SCENE_KEY, choiceQuestionScene);
        this._masterSceneController.runScene(SceneKeys.CHOICE_QUESTION_SCENE_KEY);
    }

    public addAndStartInputQuestionScene(inputQuestionScene: InputQuestionScene){
        this._masterSceneController.addScene(SceneKeys.INPUT_QUESTION_SCENE_KEY, inputQuestionScene);
        this._masterSceneController.runScene(SceneKeys.INPUT_QUESTION_SCENE_KEY);
    }

    public addAndStartDragDropQuestionScene(dragDropQuestionScene: DragDropQuestionScene){
        this._masterSceneController.addScene(SceneKeys.DRAG_DROP_QUESTION_SCENE_KEY, dragDropQuestionScene);
        this._masterSceneController.runScene(SceneKeys.DRAG_DROP_QUESTION_SCENE_KEY);
    }

    public addAndStartClozeQuestionScene(clozeQuestionScene: ClozeQuestionScene){
        this._masterSceneController.addScene(SceneKeys.CLOZE_QUESTION_SCENE_KEY, clozeQuestionScene);
        this._masterSceneController.runScene(SceneKeys.CLOZE_QUESTION_SCENE_KEY);
    }

    public addAndStartSelectOneQuestionScene(selectOneQuestionScene: SelectOneQuestionScene){
        this._masterSceneController.addScene(SceneKeys.SELECT_ONE_QUESTION_SCENE_KEY, selectOneQuestionScene);
        this._masterSceneController.runScene(SceneKeys.SELECT_ONE_QUESTION_SCENE_KEY);
    }

    public addAndStartCreateQuestionScene(createQuestionScene: CreateQuestionScene){
        this._masterSceneController.addScene(SceneKeys.CREATE_QUESTION_SCENE_KEY, createQuestionScene);
        this._masterSceneController.runScene(SceneKeys.CREATE_QUESTION_SCENE_KEY);
    }

    public removeAllQuestionScenes(){
        this._masterSceneController.removeScene(SceneKeys.CHOICE_QUESTION_SCENE_KEY)
        this._masterSceneController.removeScene(SceneKeys.INPUT_QUESTION_SCENE_KEY)
        this._masterSceneController.removeScene(SceneKeys.DRAG_DROP_QUESTION_SCENE_KEY)
        this._masterSceneController.removeScene(SceneKeys.CLOZE_QUESTION_SCENE_KEY)
        this._masterSceneController.removeScene(SceneKeys.SELECT_ONE_QUESTION_SCENE_KEY)
        this._masterSceneController.removeScene(SceneKeys.CREATE_QUESTION_SCENE_KEY)
    }

    public exitQuestionView(){
        this.removeAllQuestionScenes()
        this._masterSceneController.removeScene(SceneKeys.QUESTION_VIEW_SCENE_KEY)
    }
}