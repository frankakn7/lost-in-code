import db from '../db';

export const createQuestionElement = (requestBody: any): Promise<any> => {
    const sql =
        'INSERT INTO `question_element` (`content`, `element_identifier`, `correct_order_position`, `is_correct`, `question_id`) VALUES (?, ?, ?, ?, ?);';
    const params = [
        requestBody.content,
        requestBody.element_identifier,
        requestBody.correct_order_position,
        requestBody.is_correct,
        requestBody.question_id,
    ];
    return db.query(sql, params);
};

export const updateQuestionElement = (
    questionId: string,
    elementId: number,
    requestBody: any
): Promise<any> => {
    const sql =
        'UPDATE `question_element` SET `content` = ?, `element_identifier` = ?, `correct_order_position` = ?, `is_correct` = ?, `question_id` = ? WHERE `id` = ?;';
    const params = [
        requestBody.content,
        requestBody.element_identifier,
        requestBody.correct_order_position,
        requestBody.is_correct,
        questionId,
        elementId,
    ];
    return db.query(sql, params);
};
