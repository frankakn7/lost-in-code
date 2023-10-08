import loginFormHtml from "../assets/html/login.html";
import * as Phaser from "phaser";
import WorldViewScene from "./worldViewScene";
import ApiHelper from "../helpers/apiHelper";
import { response } from "express";
import PreloadScene from "./preloadScene";
import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";
import User from "../classes/user";

export default class LoginScene extends Phaser.Scene {

    private apiHelper: ApiHelper = new ApiHelper();

    constructor() {
        super(SceneKeys.LOGIN_VIEW_SCENE_KEY);
    }

    preload() {
        this.apiHelper.checkLoginStatus()
            .then((response:any) => this.startGame(response.user))
            .catch((error) => console.error(error));
    }

    create() {
        this.cameras.main.setBackgroundColor("#3e536d");

        const element = this.add
            .dom(
                this.cameras.main.displayWidth / 2,
                this.cameras.main.displayHeight / 2,
                "div"
            )
            .setHTML(loginFormHtml) // Using setInnerContent() instead
            .setOrigin(0.5, 0.5)
            .setScale(2);

        element.addListener("click");

        let loginView = this;

        element.on("click", function (event) {
            if (event.target.id === "submit") {
                const inputEmail = this.getChildByID("email");
                const inputPassword = this.getChildByID("password");
                loginView.apiHelper.login(inputEmail.value,inputPassword.value).then((response:any) => {
                    loginView.startGame(response.user);
                }).catch(error => {
                    const errorText = this.getChildByID("error")
                    errorText.innerHTML = error
                    errorText.style.display = "block"
                })
            }
        });

    }

    private startGame(data: any) {
        this.scene.remove(this)
        gameController.startGame(data);
    }
}
