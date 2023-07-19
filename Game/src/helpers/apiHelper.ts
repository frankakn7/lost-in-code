import {GamestateType} from "../types/gamestateType";

export default class ApiHelper {
    private apiUrl = `${process.env.API_URL}`;

    public evaluateCode(code:string){
        const url = this.apiUrl + "/api/php";
        const formData = new FormData();
        formData.append("code", code);
        console.log(formData)
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                credentials: "include",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject("Evalutaion failed");
                    }
                })
                .catch((error) => reject(error));
        });
    }
    public getStateData() {
        const url = this.apiUrl + "/api/gamestates/me";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "GET", credentials: "include"})
                .then((response) => {
                    response
                        .json()
                        .then((data) =>
                            resolve(data)
                        )
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    }

    public updateStateData(state_data: GamestateType) {
        console.log(state_data)
        const gameState = {game_state: state_data}
        console.log(JSON.stringify(gameState))
        const url = this.apiUrl + "/api/gamestates/me";
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "PUT", headers: {
                    "Content-Type": "application/json",
                }, credentials: "include", body: JSON.stringify(gameState)
            })
                .then((response) => {
                    response
                        .json()
                        .then((data) =>
                            resolve(data)
                        )
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    }

    public checkLoginStatus() {
        const url = this.apiUrl + "/api/me";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "GET", credentials: "include"})
                .then((response) => {
                    if (response.status == 200) {
                        response
                            .json()
                            .then((data) =>
                                data.user
                                    ? resolve(data)
                                    : reject("not logged in")
                            )
                            .catch((error) => reject(error));
                    } else {
                        reject("response status not 200");
                    }
                })
                .catch((error) => reject(error));
        });
    }

    public login(email, password) {
        const url = this.apiUrl + "/api/login";
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({email, password}),
            })
                .then((response) => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject("login failed");
                    }
                })
                .catch((error) => reject(error));
        });
    }

    public logout() {
        const url = this.apiUrl + "/api/logout";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "POST", credentials: "include"})
                .then((response) => {
                    if (response.status == 200) {
                        resolve(response);
                    } else {
                        reject(new Error("could not log out"));
                    }
                })
                .catch((error) => reject(error));
        });
    }
}
