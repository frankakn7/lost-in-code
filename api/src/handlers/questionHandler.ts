import db from "../db";
import { createCorrectAnswer } from "./correctAnswerHandler";
import { createQuestionElement } from "./questionElementHandler";

export type QuestionType =
    | "CHOICE"
    | "SINGLE_INPUT"
    | "CLOZE"
    | "DRAG_DROP"
    | "SELECT_ONE"
    | "CREATE";

export type QuestionValues = {
    id?: number; //id also only set at upload
    question_text: string;
    code_text?: string;
    hint: string;
    type: QuestionType;
    elements: QuestionElementValues[];
    difficulty: number;
    chapter_id: number;
};

export type QuestionElementValues = {
    id?: number; //Id also only set at upload
    content?: string;
    element_identifier?: string;
    correct_order_position?: number;
    correct_answers?: string[];
    is_correct?: boolean;
    question_id?: number; //not set when in json but at upload
};

export type CorrectAnswer = {
    id?: number; //Id also only set at upload
    answer: string;
    question_element_id?: number; //not set in json but at upload
};

export const createQuestion = (requestBody: any): Promise<any> => {
    const sql =
        "INSERT INTO `question` (`question_text`, `hint`, `type`, `difficulty`, `code_text`, `chapter_id`) VALUES (?, ?, ?, ?, ?, ?);";
    const params = [
        requestBody.question_text,
        requestBody.hint,
        requestBody.type,
        requestBody.difficulty,
        requestBody.code_text,
        requestBody.chapter_id,
    ];
    return db.query(sql, params);
};

export const createFullQuestion = (
    requestBody: QuestionValues
): Promise<any> => {
    return new Promise((resolve, reject) => {
        createQuestion(requestBody) //Create the most upper level => Question
            .then((result) => {
                const elementsPromises = requestBody.elements.map(
                    (element: QuestionElementValues) => {
                        element.question_id = result.insertId;
                        console.log(element);
                        return createQuestionElement(element) //Create all the Question elements contained in the question
                            .then((elementResult) => {
                                console.log(elementResult);
                                if (!element.correct_answers) {
                                    return;
                                }

                                const answersPromises =
                                    element.correct_answers.map(
                                        (correctAnswer: string) => {
                                            let newlyCreatedAnswer: CorrectAnswer =
                                                {
                                                    answer: correctAnswer,
                                                    question_element_id:
                                                        elementResult.insertId,
                                                };
                                            console.log(newlyCreatedAnswer);
                                            return createCorrectAnswer(
                                                newlyCreatedAnswer
                                            ); //Create all the correct answer objects contained in the question element
                                        }
                                    );

                                return Promise.all(answersPromises);
                            });
                    }
                );

                Promise.all(elementsPromises)
                    .then(() => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                // console.log(error);
                reject(error);
            });
    });
};

export const extractQuestionsFromRows = (results: any): QuestionValues[] => {
    const questions: QuestionValues[] = [];
    const questionElementsMap = new Map();

    results.forEach((row: any) => {
        let question = questions.find((q) => q.id === row.question_id);

        if (!question) {
            question = {
                id: row.question_id,
                question_text: row.question_text,
                code_text: row.code_text,
                hint: row.hint,
                type: row.type,
                difficulty: row.difficulty,
                chapter_id: row.chapter_id,
                elements: [],
            };
            questions.push(question);
        }

        if (!questionElementsMap.has(row.question_element_id)) {
            const questionElement: QuestionElementValues = {
                id: row.question_element_id,
                content: row.question_element_content,
                element_identifier: row.question_element_element_identifier,
                correct_order_position:
                    row.question_element_correct_order_position,
                is_correct: Boolean(row.question_element_is_correct),
                correct_answers: [],
            };

            questionElementsMap.set(row.question_element_id, questionElement);
            question.elements.push(questionElement);
        }

        const questionElement = questionElementsMap.get(
            row.question_element_id
        );
        if (row.answer) {
            if (questionElement.correct_answers) {
                questionElement.correct_answers.push(row.answer);
            } else {
                questionElement.correct_answers = [row.answer];
            }
        }
    });

    return questions;
};

export const getFullQuestion = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM full_question WHERE question_id = ?";
        const params = [id];
        db.query(sql, params)
            .then((results) => {
                const question = extractQuestionsFromRows(results)[0];
                resolve(question);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
