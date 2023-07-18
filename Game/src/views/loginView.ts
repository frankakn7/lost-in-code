import loginFormHtml from "../assets/html/login.html";
import * as Phaser from "phaser";
import PlayView from "./playView";

export default class LoginView extends Phaser.Scene {

    playView: PlayView;

    constructor() {
        super("LoginView");
    }

    preload() {
        // this.load.html("loginForm", loginFormHtml);
    }

    create() {
        this.cameras.main.setBackgroundColor("#3e536d");
        // const element = this.add
        //     .dom(
        //         // this.cameras.main.displayWidth / 2,
        //         // this.cameras.main.displayHeight / 2
        //         100,
        //         100
        //     )
        //     .createFromCache("loginForm")
        //     // .setOrigin(0.5, 0.5);
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
                const inputUsername = this.getChildByID("username");
                const inputPassword = this.getChildByID("password");
                console.log(inputUsername.value);
                console.log(inputPassword.value);
                if (inputUsername.value !== "" && inputPassword.value !== "") {
                    loginView.startGame()
                }
            }
        });
    }

    private startGame(){
        this.playView = new PlayView("Play")
        this.scene.add("Play", this.playView)
        this.scene.launch("Play");
        this.scene.remove(this)
    }
}
