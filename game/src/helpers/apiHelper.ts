import {GamestateType} from "../types/gamestateType";

/**
 * Helper class for making API requests related to the game.
 */
export default class ApiHelper {
    /**
     * The base URL for the API.
     * @type {string}
     * @private
     */
    private apiUrl = `${process.env.API_URL}`;

    /**
     * Evaluate the given code on the server.
     * @param {string} code - The code to be evaluated.
     * @returns {Promise} - A Promise that resolves with the server response or rejects with an error message.
     */
    public evaluateCode(code: string) {
        const url = this.apiUrl + "/php";
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

    /**
     * Get chapters specific to the current user.
     * @returns {Promise} - A Promise that resolves with the user's chapters data or rejects with an error message.
     */
    public getChapters(){
        const url = this.apiUrl + "/chapters/me";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "GET", credentials: "include"})
                .then((response) => {
                    response.json().then((data) => {
                        console.log("Getting chapters")
                        console.log(data)
                        resolve(data)
                    })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    /**
     * Get the full chapter for the given chapter number.
     * @param {number} chapterNumber - The chapter number for which to fetch the full data.
     * @returns {Promise} - A Promise that resolves with the full chapter data or rejects with an error message.
     */
    public getFullChapter(chapterNumber: number) {
        const url = this.apiUrl + "/users/me/curriculum_data";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "GET", credentials: "include"})
                .then((response) => {
                    response
                        .json()
                        .then((data) => {
                            // resolve(data);
                            const url2 = this.apiUrl + "/chapters/";
                            fetch(url2, {method: "GET", credentials: "include"})
                                .then((res) => {
                                    res.json().then((chapters: any) => {
                                        const chapter = chapters.find(chapter => chapter.order_position == chapterNumber && chapter.curriculum_id == data.curriculum_id)
                                        const url3 = this.apiUrl + "/chapters/" + chapter.id + "/full";
                                        fetch(url3, {method: "GET", credentials: "include"})
                                            .then((res) => {
                                                console.log(res)
                                                res.json().then((chapter: any) => {
                                                    resolve(chapter);
                                                }).catch((error) => reject(error));
                                            }).catch((error) => reject(error));
                                    }).catch((error) => reject(error));
                                }).catch((error) => reject(error));
                        }).catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        })
    }

    /**
     * Get the game state data for the current user.
     * @returns {Promise} - A Promise that resolves with the user's game state data or rejects with an error message.
     */
    public getStateData() {
        const url = this.apiUrl + "/gamestates/me";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "GET", credentials: "include"})
                .then((response) => {
                    response
                        .json()
                        .then((data) => {
                                console.log("GAME STATE DATA")
                                console.log(data)
                                resolve(data)
                            }
                        )
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Update the game state data for the current user.
     * @param {GamestateType} state_data - The new game state data to be updated.
     * @returns {Promise} - A Promise that resolves with the updated game state data or rejects with an error message.
     */
    public updateStateData(state_data: GamestateType
    ) {
        console.log(state_data)
        const gameState = {game_state: state_data}
        console.log(JSON.stringify(gameState))
        const url = this.apiUrl + "/gamestates/me";
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

    /**
     * Check the login status of the current user.
     * @returns {Promise} - A Promise that resolves if the user is logged in, or rejects with an error message otherwise.
     */
    public checkLoginStatus() {
        const url = this.apiUrl + "/me";
        return new Promise((resolve, reject) => {
            fetch(url, {method: "GET", credentials: "include"})
                .then((response) => {
                    console.log(response)
                    if (response.status == 200) {
                        response
                            .json()
                            .then((data) => {
                                    console.log(data.user)
                                    data.user
                                        ? resolve(data)
                                        : reject("not logged in")
                                }
                            )
                            .catch((error) => reject(error));
                    } else {
                        reject("response status not 200");
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Log in the user with the provided email and password.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise} - A Promise that resolves with the user data if login is successful, or rejects with an error message otherwise.
     */
    public login(email, password) {
        const url = this.apiUrl + "/login";
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
                        response
                            .json()
                            .then((data) => {
                                console.log(data)
                                    data.user
                                        ? resolve(data)
                                        : reject("no user data")
                                }
                            )
                            .catch((error) => reject(error));
                    } else {
                        reject("login failed");
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Log out the current user.
     * @returns {Promise} - A Promise that resolves if the logout is successful, or rejects with an error message otherwise.
     */
    public logout() {
        const url = this.apiUrl + "/logout";
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
