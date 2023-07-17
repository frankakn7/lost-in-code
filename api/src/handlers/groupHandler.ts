import db from "../db";

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
