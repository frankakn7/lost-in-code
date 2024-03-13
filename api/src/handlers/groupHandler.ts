import db from "../db";
import {RowDataPacket} from "mysql2";

export const getUsersFromGroup = (groupId: string) => {
    const sql = "SELECT * FROM `user` WHERE group_id = ?;";
    const params = [groupId];

    let resultGroup: any;

    return db.query(sql, params);
};

export const getFullGroup = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `group` WHERE id = ?;";
        const params = [id];

        let resultGroup: any;

        db.query(sql, params)
            .then((results: any) => {
                if (!results.length) {
                    reject(new Error("No group with that ID"));
                } else {
                    resultGroup = results[0];
                    getUsersFromGroup(id)
                        .then((usersResult) => {
                            resultGroup.users = usersResult ?? [];
                            resolve(resultGroup);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getUsernamesAndIdFromGroup = (groupId: string) => {
    const sql = "SELECT id, username FROM `user` WHERE group_id = ?;";
    const params = [groupId];

    return db.query(sql, params);
};

export const getPointsUserArray = async (users: {username: string, id: string, points: number }[]) => {
    await users.forEach(async (user) => {
        user.points = await getPointsFromUser(user.id);
    })

    return users;
}

export const getPointsFromUser = async (userId: string) => {
    const sql = "SELECT state_data FROM `game_state` WHERE user_id = ?;";
    const params = [userId];

    try {
        let results = await db.query(sql, params);
        if (
            results instanceof Array &&
            results.length > 0 &&
            "state_data" in results[0]
        ) {
            return results[0].state_data.user.points;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error querying from the database:", error);
        return 0;
    }
};

export const getGroupLeaderboard = (groupId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        getUsernamesAndIdFromGroup(groupId)
            .then(async (usersResult) => {
                let resultGroup = usersResult as any[];
                resultGroup = await Promise.all(resultGroup.map(
                    async (user: { username: string; id: string }) => {
                        let userAndPoints = {...user, points: 0};
                        userAndPoints.points = await getPointsFromUser(user.id);
                        return userAndPoints;
                    }
                ));
                console.log(resultGroup)
                resolve(resultGroup);
            })
            .catch((error) => {
                reject(error);
            });
        //     }
        // })
        // .catch((error) => {
        //     reject(error);
        // });
    });
};
