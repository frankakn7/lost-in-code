import express, { Request, Response } from "express";
import db from "../db";
import { createChapterWithQuestions, getChapterWithQuestions } from "../handlers/chapterHandler";

const router = express.Router();

/**
 * Create new chapter
 */
router.post("/", (req: Request, res: Response) => {
    const chapter = req.body;
    const sql =
        "INSERT INTO `chapter` (`name`, `material`, `curriculum_id`) VALUES (?, ?, ?);";
    const params = [chapter.name, chapter.material, chapter.curriculum_id];
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
 * Create new chapter with questions
 */
router.post("/questions", (req: Request, res: Response) => {
    createChapterWithQuestions(req.body)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Get all chapters
 */
router.get("/", (req: Request, res: Response) => {
    const sql = "SELECT * FROM `chapter`;";
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
 * Get specific chapter
 */
router.get("/:id", (req: Request, res: Response) => {
    const chapterId = req.params.id;
    const sql = "SELECT * FROM `chapter` WHERE `id` = ?;";
    const params = [chapterId];
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
 * Get specific chapter and all questions
 */
router.get("/:id/questions", (req: Request, res: Response) => {
    const chapterId = req.params.id;
    getChapterWithQuestions(chapterId)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * update specific chapter
 */
router.put("/:id", (req: Request, res: Response) => {
    const chapterId = req.params.id;
    const chapter = req.body;
    const sql =
        "UPDATE `chapter` SET `name` = ?, `material` = ?, `curriculum_id` = ? WHERE `id` = ?;";
    const params = [
        chapter.name,
        chapter.material,
        chapter.curriculum_id,
        chapterId,
    ];
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
 * Delete sepecific chapter
 */
router.delete("/:id", (req: Request, res: Response) => {
    const chapterId = req.params.id;
    const sql = "DELETE FROM `chapter` WHERE `id` = ?;";
    const params = [chapterId];
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
 * Change associated curriculum for chapter
 */
router.post(
    "/:chapterId/curriculums/:curriculumId",
    (req: Request, res: Response) => {
        const chapterId = req.params.chapterId;
        const curriculumId = req.params.curriculumId;
        const sql = "UPDATE `chapter` SET `curriculum_id` = ? WHERE `id` = ?;";
        const params = [curriculumId, chapterId];
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

// router.delete(
//     "/:chapterId/curriculums/:curriculumId",
//     (req: Request, res: Response) => {
//         const chapterId = req.params.chapterId;
//         const curriculumId = req.params.curriculumId;
//         res.send(
//             `Remove chapter with ID ${chapterId} from curriculum with ID ${curriculumId}`
//         );
//     }
// );

export default router;
