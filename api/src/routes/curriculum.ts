import express, { Request, Response } from "express";
import db from "../db";
import {
    createFullCurriculum,
    getFullCurriculum,
} from "../handlers/curriculumHandler";
import { requireAdminRole } from "../auth";

const router = express.Router();

/**
 * create new curriculum
 */
router.post("/", requireAdminRole, (req: Request, res: Response) => {
    const curriculum = req.body;
    const sql =
        "INSERT INTO `curriculum` (`name`, `description`) VALUES (?, ?);";
    const params = [curriculum.name, curriculum.description];
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
 * create new FULL curriculum
 */
router.post("/full", requireAdminRole, (req: Request, res: Response) => {
    createFullCurriculum(req.body)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Get all curriculums
 */
router.get("/", (req: Request, res: Response) => {
    const sql = "SELECT * FROM `curriculum`;";
    db.query(sql)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * get specific curriculum via id
 */
router.get("/:id", (req: Request, res: Response) => {
    const curriculumId = req.params.id;
    const sql = "SELECT * FROM `curriculum` WHERE `id` = ?;";
    const params = [curriculumId];
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
 * get specific FULL curriculum via id
 */
router.get("/:id/full", (req: Request, res: Response) => {
    const curriculumId = req.params.id;
    getFullCurriculum(curriculumId)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Update specific curriculum
 */
router.put("/:id", requireAdminRole, (req: Request, res: Response) => {
    const curriculumId = req.params.id;
    const curriculum = req.body;
    const sql =
        "UPDATE `curriculum` SET `name` = ?, `description` = ? WHERE `id` = ?;";
    const params = [curriculum.name, curriculum.description, curriculumId];
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
 * Delete specific curriculum
 */
router.delete("/:id", requireAdminRole, (req: Request, res: Response) => {
    const curriculumId = req.params.id;
    const sql = "DELETE FROM `curriculum` WHERE `id` = ?;";
    const params = [curriculumId];
    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

// router.delete(
//     "/:curriculumId/groups/:groupId",
//     (req: Request, res: Response) => {
//         const curriculumId = req.params.curriculumId;
//         const groupId = req.params.groupId;
//         res.send(
//             `Remove curriculum with ID ${curriculumId} from group with ID ${groupId}`
//         );
//     }
// );

export default router;
