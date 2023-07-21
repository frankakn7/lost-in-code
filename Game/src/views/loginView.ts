import loginFormHtml from "../assets/html/login.html";
import * as Phaser from "phaser";
import RootNode from "./rootNode";
import ApiHelper from "../helpers/apiHelper";
import { response } from "express";

export default class LoginView extends Phaser.Scene {
    playView: RootNode;
    private apiHelper: ApiHelper = new ApiHelper();

    constructor() {
        super("LoginView");
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
        this.apiHelper.getStateData().then((data:any) => {
            console.log("### STARTING GAME")
            console.log(data.state_data);
            if(data.state_data){
                this.playView = new RootNode(userData, data.state_data);
            }else{
                this.playView = new RootNode();
            }
            this.scene.add("Play", this.playView);
            this.scene.launch("Play");
            this.scene.remove(this);
        }).catch((error) => console.error(error));
    }
}
