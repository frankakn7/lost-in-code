import express, { Request, Response } from "express";
import db from "../db";
import {
    createFullQuestion,
    createQuestion,
    getFullQuestion,
} from "../handlers/questionHandler";

const router = express.Router();

/**
 * Create new question
 */
router.post("/", (req: Request, res: Response) => {
    const question = req.body;
    createQuestion(question)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Create new FULL question
 */
router.post("/full", (req: Request, res: Response) => {
    const question = req.body;
    createFullQuestion(question)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * get all questions
 */
router.get("/", (req: Request, res: Response) => {
    const sql = "SELECT * FROM `question`;";
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
 * get a specific question
 */
router.get("/:id", (req: Request, res: Response) => {
    const questionId = req.params.id;
    const sql = "SELECT * FROM `question` WHERE `id` = ?;";
    const params = [questionId];
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
 * get a FULL specific question
 */
router.get("/:id/full", (req: Request, res: Response) => {
    const questionId = req.params.id;
    getFullQuestion(questionId)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Update a question
 */
router.put("/:id", (req: Request, res: Response) => {
    const questionId = req.params.id;
    const question = req.body;
    const sql =
        "UPDATE `question` SET `question_text` = ?, `hint` = ?, `type` = ?, `difficulty` = ?, `code_text` = ?, `chapter_id` = ? WHERE `id` = ?;";
    const params = [
        question.question_text,
        question.hint,
        question.type,
        question.difficulty,
        question.code_text,
        question.chapter_id,
        questionId,
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
 * delete a specific question
 */
router.delete("/:id", (req: Request, res: Response) => {
    const questionId = req.params.id;
    const sql = "DELETE FROM `question` WHERE `id` = ?;";
    const params = [questionId];
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
 * Change question chapter
 */
router.post(
    "/:questionId/chapters/:chapterId",
    (req: Request, res: Response) => {
        const questionId = req.params.questionId;
        const chapterId = req.params.chapterId;
        const sql = "UPDATE `question` SET `chapter_id` = ? WHERE `id` = ?;";
        const params = [chapterId, questionId];
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
//     "/:questionId/chapters/:chapterId",
//     (req: Request, res: Response) => {
//         const questionId = req.params.questionId;
//         const chapterId = req.params.chapterId;
//         res.send(
//             `Remove question with ID ${questionId} from chapter with ID ${chapterId}`
//         );
//     }
// );

export default router;
