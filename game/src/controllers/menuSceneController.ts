import { SceneKeys } from "../types/sceneKeys";
import MasterSceneController from "./masterSceneController";
import DocViewScene from "../scenes/docView/docViewScene";
import TextViewScene from "../scenes/docView/textViewScene";
import AchievementViewScene from "../scenes/achievementViewScene";
import HatViewScene from "../scenes/hatViewScene";
import MenuViewScene from "../scenes/menuViewScene";
import { Scene } from "phaser";
import LeaderboardViewScene from "../scenes/leaderboardViewScene";

export default class MenuSceneController {
    private _masterSceneController: MasterSceneController;

    private _docViewScene: DocViewScene;
    private _achievementViewScene: AchievementViewScene;
    private _leaderboardViewScene: LeaderboardViewScene;
    private _hatViewScene: HatViewScene;
    private _achievementView: AchievementViewScene;

    private _menuViewScene: MenuViewScene;

    constructor(masterSceneController: MasterSceneController) {
        this._masterSceneController = masterSceneController;

        this._docViewScene = new DocViewScene();
        this._achievementViewScene = new AchievementViewScene();
        this._hatViewScene = new HatViewScene();
        this._achievementView = new AchievementViewScene();
        this._leaderboardViewScene = new LeaderboardViewScene();

        this._menuViewScene = new MenuViewScene();

        this.setupMenuScenes();
    }

    backToDocViewScene() {
        this._masterSceneController.sleepAllScenes();
        this._masterSceneController.removeScene(SceneKeys.TEXT_VIEW_SCENE_KEY);
        this._masterSceneController.wakeScene(SceneKeys.DOC_VIEW_SCENE_KEY);
    }

    backToMenuScene() {
        this._masterSceneController.sleepAllScenes();
        this._masterSceneController.wakeScene(SceneKeys.MENU_VIEW_SCENE_KEY);
    }

    setupMenuScenes() {
        this._masterSceneController.addScene(SceneKeys.DOC_VIEW_SCENE_KEY, this._docViewScene);
        this._masterSceneController.addScene(SceneKeys.ACHIEVEMENT_VIEW_SCENE_KEY, this._achievementViewScene);
        this._masterSceneController.addScene(SceneKeys.LEADERBOARD_VIEW_SCENE_KEY, this._leaderboardViewScene);
        this._masterSceneController.addScene(SceneKeys.HAT_VIEW_SCENE_KEY, this._hatViewScene);

        this._masterSceneController.addScene(SceneKeys.MENU_VIEW_SCENE_KEY, this._menuViewScene);
    }

    startMenuScene() {
        this._masterSceneController.sleepAllScenes();
        if (this._masterSceneController.isSceneSleeping(SceneKeys.MENU_VIEW_SCENE_KEY)) {
            this._masterSceneController.wakeScene(SceneKeys.MENU_VIEW_SCENE_KEY);
        } else {
            this._masterSceneController.runScene(SceneKeys.MENU_VIEW_SCENE_KEY);
        }
    }

    private startSubMenuScene(subMenuSceneKey: string) {
        this._masterSceneController.sleepAllScenes();
        this._masterSceneController.runScene(subMenuSceneKey);
    }

    openHatViewScene() {
        this.startSubMenuScene(SceneKeys.HAT_VIEW_SCENE_KEY);
    }

    openAcheivementViewScene() {
        this.startSubMenuScene(SceneKeys.ACHIEVEMENT_VIEW_SCENE_KEY);
    }

    openLeaderboardViewScene() {
        this.startSubMenuScene(SceneKeys.LEADERBOARD_VIEW_SCENE_KEY);
    }

    openDocViewScene() {
        this.startSubMenuScene(SceneKeys.DOC_VIEW_SCENE_KEY);
    }
}
