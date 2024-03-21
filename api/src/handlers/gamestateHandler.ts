import db from '../db';
import { getUsersFromGroup } from './groupHandler';
import { RowDataPacket } from 'mysql2';

export const createGamestate = (
    req: any,
    res: any,
    userId: any,
    gameState: any
) => {
    const sql =
        'INSERT INTO `game_state` (`state_data`, `user_id`) VALUES (?, ?);';
    const params = [JSON.stringify(gameState), userId];

    db.query(sql, params)
        .then((results) => {
            res.json({
                message: `New game state created for user ID ${userId}.`,
            });
        })
        .catch((error) => {
            console.error('Error inserting into the database:', error);
            return res.status(500).send('Server error');
        });
};

export const getGameState = (req: any, res: any, userId: any) => {
    const sql = 'SELECT * FROM `game_state` WHERE user_id = ?;';
    const params = [userId];

    db.query(sql, params)
        .then((results: any) => {
            res.json(results[0] ?? {});
        })
        .catch((error) => {
            console.error('Error querying from the database:', error);
            return res.status(500).send('Server error');
        });
};

export const updateGameState = (
    req: any,
    res: any,
    userId: any,
    game_state: any
) => {
    const sql =
        'INSERT INTO `game_state` (`user_id`, `state_data`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `state_data` = ?;';
    const params = [
        userId,
        JSON.stringify(game_state),
        JSON.stringify(game_state),
    ];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error updating the database:', error);
            return res.status(500).send('Server error');
        });
};

export const deleteGamestatesFromGroup = async (
    req: any,
    res: any,
    groupId: any
) => {
    try {
        const users: RowDataPacket[] = (await getUsersFromGroup(
            groupId
        )) as RowDataPacket[];
        if (!users || users.length === 0) {
            return res.status(404).send('No users found in the group');
        }

        const userIds = users.map((user) => user.id);
        const sql = `DELETE FROM game_state WHERE user_id IN (${userIds.map(() => '?').join(',')});`;

        await db.query(sql, userIds);
        res.json({ message: `Game states for group ID ${groupId} deleted.` });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Could not delete gamestates' });
    }
};
