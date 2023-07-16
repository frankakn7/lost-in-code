import express, { Request, Response } from "express";
import db from "../db";
import { requireAdminRole } from "../auth";

const router = express.Router();

/**
 * create new group
 */
router.post("/", requireAdminRole, (req: Request, res: Response) => {
    const group = req.body;

    const sql =
        "INSERT INTO `group` (`name`, `description`, `curriculum_id`) VALUES (?, ?, ?);";
    const params = [group.name, group.description, group.curriculum_id];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error("Error inserting into the database:", error);
            return res.status(500).send("Server error");
        });
});

/**
 * Get all groups
 */
router.get("/", requireAdminRole, (req: Request, res: Response) => {
    const sql = "SELECT * FROM `group`;";

    db.query(sql)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error("Error inserting into the database:", error);
            return res.status(500).send("Server error");
        });
});

/**
 * Get a specific group
 */
router.get("/:id", requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    const sql = "SELECT * FROM `group` WHERE id = ?;";
    const params = [groupId];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error("Error inserting into the database:", error);
            return res.status(500).send("Server error");
        });
});

/**
 * Update a specific group
 */
router.put("/:id", requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    const group = req.body;
    const sql =
        "UPDATE `group` SET `name` = ?, `description` = ?, `curriculum_id` = ? WHERE `id` = ?;";
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
            console.error("Error inserting into the database:", error);
            return res.status(500).send("Server error");
        });
});

/**
 * Delete a specific group
 */
router.delete("/:id", requireAdminRole, (req: Request, res: Response) => {
    const groupId = req.params.id;
    const sql = "DELETE FROM `group` WHERE id = ?";
    const params = [groupId];
    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Set curriculum for specific group
 */
router.post(
    "/:curriculumId/groups/:groupId",
    requireAdminRole,
    (req: Request, res: Response) => {
        const curriculumId = req.params.curriculumId;
        const groupId = req.params.groupId;
        const sql = "UPDATE `group` SET `curriculum_id` = ? WHERE `id` = ?;";
        const params = [curriculumId, groupId];
        db.query(sql, params)
            .then((results) => {
                res.send(results);
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send("Server error");
            });
    }
);

export default router;
