import { ChatFlowNode } from "./chatFlowNode";

/**
 * A class for controlling the chat flow of a thread defined through {@link ChatFlowNode}`s
 */
export default class ChatFlow {
    /**
     * The current chat node being handled
     */
    private currentNode: ChatFlowNode;

    /**
     * Constructs the chatFlow by setting the current node to the first node
     * @param firstNode the first node in the sequence of linked {@link ChatFlowNode}
     */
    constructor(firstNode: ChatFlowNode) {
        this.currentNode = firstNode;
    }

    /**
     * Get the text of the current node
     * @returns the text of the current node as string
     */
    public getCurrentText(): string {
        return this.currentNode.text;
    }

    /**
     * Gets the choices of the current node
     * @returns an array containing the choices as strings
     */
    public getCurrentChoices(): Array<string> {
        return [...this.currentNode.choices.keys()];
    }

    /**
     * Select a choice by its string
     * @param choiceText the text displayed by the choice
     */
    public selectChoice(choiceText: string): void {
        let newNode = this.currentNode.choices.get(choiceText);
        this.currentNode = newNode;
    }
}
