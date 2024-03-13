import express, { Request, Response } from 'express';
import db from '../db';
import { requireAdminRole } from '../auth';
import { getFullGroup, getGroupLeaderboard } from '../handlers/groupHandler';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

/**
 * create new group
 */
router.post('/', requireAdminRole, (req: Request, res: Response) => {
    const group = req.body;

    const sql =
        'INSERT INTO `group` (`name`, `description`, `curriculum_id`) VALUES (?, ?, ?);';
    const params = [group.name, group.description, group.curriculum_id];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error inserting into the database:', error);
            return res.status(500).send('Server error');
        });
});

/**
 * Get all groups
 */
router.get('/', requireAdminRole, (req: Request, res: Response) => {
    const sql = 'SELECT * FROM `group`;';

    db.query(sql)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error inserting into the database:', error);
            return res.status(500).send('Server error');
        });
});

/**
 * Get a specific group
 */
router.get('/:id', requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    const sql = 'SELECT * FROM `group` WHERE id = ?;';
    const params = [groupId];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error inserting into the database:', error);
            return res.status(500).send('Server error');
        });
});

/**
 * Get a FULL specific group
 */
router.get('/:id/full', requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    getFullGroup(groupId)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error getting full group:', error);
            return res.status(500).send('Server error');
        });
});

/**
 * Get Leaderboard for MY Group
 */
router.get('/me/leaderboard', (req: Request, res: Response) => {
    const sql = 'SELECT `group_id` FROM `user` WHERE id = ?;';
    const userId = req.body.user.id;
    const params = [userId];
    db.query(sql, params)
        .then((results) => {
            // res.send(results);
            const rowData = results as RowDataPacket;
            const groupId = rowData[0].group_id;
            getGroupLeaderboard(groupId)
                .then((results) => {
                    res.send(results);
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).send('Server error');
                });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send('Server error');
        });
});

/**
 * Get Leaderboard for Group ID
 */
router.get('/:id/leaderboard', (req: Request, res: Response) => {
    const groupId = req.params.id;
    getGroupLeaderboard(groupId)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error getting group leaderboard:', error);
            return res.status(500).send('Server error');
        });
});

/**
 * Update a specific group
 */
router.put('/:id', requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    const group = req.body;
    const sql =
        'UPDATE `group` SET `name` = ?, `description` = ?, `curriculum_id` = ? WHERE `id` = ?;';
    const params = [
        group.name,
        group.description,
        group.curriculum_id,
        groupId,
    ];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error('Error inserting into the database:', error);
            return res.status(500).send('Server error');
        });
});

/**
 * Delete a specific group
 */
router.delete('/:id', requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    const sql = 'DELETE FROM `group` WHERE id = ?';
    const params = [groupId];
    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send('Server error');
        });
});

/**
 * Set curriculum for specific group
 */
router.post(
    '/:curriculumId/groups/:groupId',
    requireAdminRole,
    (req: Request, res: Response) => {
        const curriculumId = req.params.curriculumId;
        const groupId = req.params.groupId;
        const sql = 'UPDATE `group` SET `curriculum_id` = ? WHERE `id` = ?;';
        const params = [curriculumId, groupId];
        db.query(sql, params)
            .then((results) => {
                res.send(results);
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send('Server error');
            });
    }
);

export default router;
