import {gameController} from "../main";
import MasterSceneController from "./masterSceneController";
import {SceneKeys} from "../types/sceneKeys";
import QuestionViewScene from "../scenes/questionView/questionViewScene";
import {ChapterType} from "../managers/chapterManager";

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
                // this.scene.wake(this.questionView);
                this._masterSceneController.wakeScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
                //If the chat view hasn't been launched yet
                // } else if(this.scene.isActive(this.questionView)){
                //     console.log(this.scene.isActive(this.questionView))
                //     return;
            } else {
                //create a new question view
                this._questionView = new QuestionViewScene();
                //add question view to the scene
                // this.scene.add("questionView", this.questionView);
                gameController.masterSceneController.addScene(SceneKeys.QUESTION_VIEW_SCENE_KEY, this._questionView);
                //launch the question view
                // this.scene.launch(this.questionView);
                gameController.masterSceneController.startScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
            }
        } else {
            gameController.gameStateManager.user.newChapter = false
            gameController.chapterManager.updateChapters().then((chapters: ChapterType[]) => {
                gameController.chatSceneController.openTextChatView(chapters.find(chapter => chapter.order_position == gameController.gameStateManager.user.chapterNumber).material, () => {
                    // this.scene.remove("ChatTextView");
                    gameController.chatSceneController.removeTextChatView();
                    if (this._masterSceneController.isSceneSleeping(SceneKeys.QUESTION_VIEW_SCENE_KEY)) {
                        // this.scene.wake(this.questionView);
                        this._masterSceneController.wakeScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
                        //If the chat view hasn't been launched yet
                        // } else if(this.scene.isActive(this.questionView)){
                        //     console.log(this.scene.isActive(this.questionView))
                        //     return;
                    } else {
                        //create a new question view
                        this._questionView = new QuestionViewScene();
                        //add question view to the scene
                        // this.scene.add("questionView", this.questionView);
                        this._masterSceneController.addScene(SceneKeys.QUESTION_VIEW_SCENE_KEY, this._questionView)
                        //launch the question view
                        // this.scene.launch(this.questionView);
                        this._masterSceneController.startScene(SceneKeys.QUESTION_VIEW_SCENE_KEY);
                    }
                })
            });
        }
    }
}