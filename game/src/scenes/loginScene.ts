import loginFormHtml from "../assets/html/login.html";
import * as Phaser from "phaser";
import WorldViewScene from "./worldViewScene";
import ApiHelper from "../helpers/apiHelper";
import { response } from "express";
import PreloadScene from "./preloadScene";

export default class LoginScene extends Phaser.Scene {
    worldViewScene: WorldViewScene;
    // preloadScene = new PreloadScene();
    private apiHelper: ApiHelper = new ApiHelper();

    constructor() {
        super("LoginScene");
    }

    preload() {
        // this.load.html("loginForm", loginFormHtml);
        this.apiHelper.checkLoginStatus()
            .then((response:any) => this.startGame(response.user))
            .catch((error) => console.log(error));
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
                    console.log("RESPONSE")
                    console.log(response)
                    loginView.startGame(response.user);
                }).catch(error => {
                    const errorText = this.getChildByID("error")
                    errorText.innerHTML = error
                    errorText.style.display = "block"
                })
            }
        });
    }

    

    private startGame(userData:any) {
        console.log(userData)
        console.log("### STARTING GAME")
        this.apiHelper.getStateData().then((data:any) => {
            console.log("### STARTING GAME")
            console.log(data.state_data);
            console.log("### USER DATA")
            console.log(userData)
            if(data.state_data){
                this.worldViewScene = new WorldViewScene(userData, data.state_data);
            }else if(userData){
                this.worldViewScene = new WorldViewScene(userData);
            }else{
                this.worldViewScene = new WorldViewScene();
            }
            this.scene.add("worldViewScene", this.worldViewScene)
            this.scene.start('PreloadScene', { worldViewScene: this.worldViewScene });
            // this.scene.add("worldViewScene", this.worldViewScene);
            // this.scene.launch("worldViewScene");
            this.scene.remove(this);
        }).catch((error) => console.error(error));
    }
}
