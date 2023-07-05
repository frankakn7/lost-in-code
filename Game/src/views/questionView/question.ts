import QuestionElement from "./questionElement";

export default class Question {
    id: number;
    questionText: string;
    hint: string;
    type: QuestionType;
    elements: typeof QuestionElement[];

    constructor(id: number, questionText: string, hint: string, type: QuestionType, elements: typeof QuestionElement[]) {
        this.id = id;
        this.questionText = questionText;
        this.hint = hint;
        this.type = type;
        this.elements = elements;
    }
}