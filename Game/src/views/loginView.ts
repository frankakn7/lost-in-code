import loginFormHtml from "../assets/html/login.html";
import * as Phaser from "phaser";
import PlayView from "./playView";
import ApiHelper from "../helpers/apiHelper";
import { response } from "express";

export default class LoginView extends Phaser.Scene {
    playView: PlayView;
    private apiHelper: ApiHelper = new ApiHelper();

    constructor() {
        super("LoginView");
    }

    preload() {
        // this.load.html("loginForm", loginFormHtml);
        this.apiHelper.checkLoginStatus()
            .then((response) => this.startGame())
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
                loginView.apiHelper.login(inputEmail.value,inputPassword.value).then(response => {
                    loginView.startGame();
                }).catch(error => {
                    const errorText = this.getChildByID("error")
                    errorText.innerHTML = error
                    errorText.style.display = "block"
                })
            }
        });
    }

    

    private startGame() {
        this.apiHelper.getStateData().then((data:any) => {
            console.log(data.state_data);
            if(data.state_data){
                this.playView = new PlayView(data.state_data);
            }else{
                this.playView = new PlayView();
            }
            this.scene.add("Play", this.playView);
            this.scene.launch("Play");
            this.scene.remove(this);
        }).catch((error) => console.error(error));
    }
}
