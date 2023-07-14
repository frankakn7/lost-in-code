import express, { Request, Response } from "express";
import db from "../db";
import { createQuestionElement } from "../handlers/questionElementHandler";

const router = express.Router();

/**
 * Create new question element
 */
router.post("/", (req: Request, res: Response) => {
    createQuestionElement(req.body)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * get all question elements
 */
router.get("/", (req: Request, res: Response) => {
    const sql = "SELECT * FROM `question_element`;";
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
 * get a specific question element
 */
router.get("/:id", (req: Request, res: Response) => {
    const questionElementId = req.params.id;
    const sql = "SELECT * FROM `question_element` WHERE `id` = ?;";
    const params = [questionElementId];
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
 * Update a question
 */
router.put("/:id", (req: Request, res: Response) => {
    const questionElementId = req.params.id;
    const questionElement = req.body;
    const sql =
        "UPDATE `question_element` SET `content` = ?, `element_identifier` = ?, `correct_order_position` = ?, `is_correct` = ?, `question_id` = ? WHERE `id` = ?;";
    const params = [
        questionElement.content,
        questionElement.element_identifier,
        questionElement.correct_order_position,
        questionElement.is_correct,
        questionElement.question_id,
        questionElementId,
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
 * delete a specific question_element
 */
router.delete("/:id", (req: Request, res: Response) => {
    const questionElement = req.params.id;
    const sql = "DELETE FROM `question_element` WHERE `id` = ?;";
    const params = [questionElement];
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
    "/:questionElementId/question/:questionId",
    (req: Request, res: Response) => {
        const questionId = req.params.questionId;
        const questionElementId = req.params.questionElementId;
        const sql =
            "UPDATE `question_element` SET `question_id` = ? WHERE `id` = ?;";
        const params = [questionElementId, questionId];
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
