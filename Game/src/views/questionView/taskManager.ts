import Question from "./question";

export default class TaskManager {
    private availableQuestions: Question[];
    //TODO: implement topic id properly
    private currentTopicId: number = 1;

    //TODO: Implement loading questions from api

    private shuffleQuestions(questions: Question[]) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = questions[i];
          questions[i] = questions[j];
          questions[j] = temp;
        }
      }

    getRandomQuestion(){
        this.shuffleQuestions(this.availableQuestions);
        return this.availableQuestions.pop();
    }

    constructor(questions: Question[]){
        this.availableQuestions = questions;
    }
}