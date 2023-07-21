/**
 * Defines the basic question element and their answers for a question; different uses for different {@link QuestionType}'s
 * - {@link ChoiceQuestionElement}: Single / Multiple Choice
 * - {@link InputQuestionElement}: Single input / cloze questions
 * - {@link OrderQuestionElement}: drag and drop ordering questions
 * - {@link SnippetQuestionElement}: create code out of snippets 
 */
interface QuestionElement {
    /**
     * Id of the question element
     */
    readonly id: number;
    /**
     * The label or displayed content on the element (button text)
     */
    content?: string;
    /**
     * The identifier of html input elements if needed
     */
    element_identifier?: string;
    /**
     * The correct position of the element in ordering questions
     */
    correct_order_position?: number;
    /**
     * Correct answer strings for input questions
     */
    correct_answers?: string[];
    /**
     * Is the element part of the correct answer (choice questions, snippet questions)
     */
    is_correct?: boolean;

    /**
     * Checks if the provided answer is correct and the element is part of the correct answer
     * @param answer the inputted string, or order position the element was placed in or if the element was selected
     */
    checkIfCorrect(answer: string | number | boolean): boolean;
}

/**
 * A question element like button or code block for questions where a choice has to be made
 */
class ChoiceQuestionElement implements QuestionElement {
    readonly id: number;
    content: string;
    is_correct: boolean;

    constructor(id: number, content: string, isCorrect: boolean) {
        this.id = id;
        this.content = content;
        this.is_correct = isCorrect;
    }

    /**
     * 
     * @param isSelected was element selected by user
     * @returns true if element was correctly selected
     */
    public checkIfCorrect(isSelected: boolean): boolean {
        return isSelected === this.is_correct;
    }
}

/**
 * A question element for questions with input fields
 */
class InputQuestionElement implements QuestionElement {
    readonly id: number;
    correct_answers: string[];
    element_identifier: string;

    constructor(
        id: number,
        correctAnswers: string[],
        elementIdentifier: string
    ) {
        this.id = id;
        this.correct_answers = correctAnswers;
        this.element_identifier = elementIdentifier;
    }

    /**
     * 
     * @param userAnswer the answer the user gave in the input
     * @returns true if the given input is part of {@link correct_answers}
     */
    public checkIfCorrect(userAnswer: string): boolean {
        return this.correct_answers.includes(userAnswer);
    }
}

/**
 * A question element for questions where ordering is needed
 */
class OrderQuestionElement implements QuestionElement {
    readonly id: number;
    content: string;
    correct_order_position: number;

    constructor(id: number, content: string, correctOrderPosition: number) {
        this.id = id;
        this.content = content;
        this.correct_order_position = correctOrderPosition;
    }

    /**
     * 
     * @param position the position the user placed the element in
     * @param isSelected **not needed**
     * @returns correct if the user position is equal to {@link correct_order_position}
     */
    public checkIfCorrect(position: number, isSelected?: boolean): boolean {
        return position == this.correct_order_position;
    }
}

/**
 * A question element for questions where snippets are arranged in the correct order
 */
class SnippetQuestionElement
    extends OrderQuestionElement
    implements QuestionElement
{
    is_correct: boolean;

    constructor(
        id: number,
        content: string,
        correctOrderPosition: number,
        isCorrect: boolean
    ) {
        super(id, content, correctOrderPosition);
        this.is_correct = isCorrect;
    }

    /**
     * 
     * @param position the position the user placed the snippet in
     * @param isSelected if user selected the snippet
     * @returns true if element was correctly selected and placed
     */
    public checkIfCorrect(position: number, isSelected?: boolean): boolean {
        if(isSelected == this.is_correct){
            if(this.is_correct){
                return super.checkIfCorrect(position)
            }else{
                return true
            }
        }else{
            return false
        }
    }
}

/**
 * Question element for containing tests for create question
 */
class CreateQuestionElement implements QuestionElement {
    readonly id: number;
    content: string;
    correct_answers: string[];
    element_identifier: string;


    constructor(id:number, content: string, correctAnswers: string[], elementIdentifier:string) {
        this.id = id;
        this.content = content;
        this.correct_answers = correctAnswers;
        this.element_identifier = elementIdentifier;
    }

    public checkIfCorrect(answer: string | number | boolean): boolean {
        return null;
    }
}

export {
    QuestionElement,
    ChoiceQuestionElement,
    InputQuestionElement,
    OrderQuestionElement,
    SnippetQuestionElement,
    CreateQuestionElement
};
