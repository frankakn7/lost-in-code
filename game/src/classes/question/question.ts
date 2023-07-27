import { QuestionType } from "../../types/questionType";
import { QuestionElement } from "./questionElement";

/**
 * A class representing a question
 */
export default class Question {
    /**
     * The id of the question
     */
    id: number;
    /**
     * The text displayed when the question is asked
     */
    question_text: string;
    /**
     * The code block to be displayed for certain questions
     */
    code_text?: string;
    /**
     * A hint that can be displayed
     */
    hint: string;
    /**
     * The question type (see {@link QuestionType})
     */
    type: QuestionType;
    /**
     * The question elements used to answer the question
     */
    elements: QuestionElement[];
    /**
     * A value between 1 - 5 of the difficulty level perceived by the creator of the question
     */
    difficulty: number;

    constructor(id: number, questionText: string, hint: string, type: QuestionType, elements: QuestionElement[],difficulty: number, codeText?: string) {
        this.id = id;
        this.question_text = questionText;
        this.hint = hint;
        this.type = type;
        this.elements = elements;
        this.difficulty = difficulty;
        this.code_text = codeText;
    }
}