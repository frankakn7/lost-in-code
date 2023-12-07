import { gameController } from "../../main";

export default class BayesianKnowledgeTracingManager {
    private normalPdf(x, mean, stddev) {
        var exp = Math.exp(-0.5 * Math.pow((x - mean) / stddev, 2));
        return (1 / (stddev * Math.sqrt(2 * Math.PI))) * exp;
    }

    private getSkewedProbabilities(length, mean, stddev, skew) {
        const probs = Array.from({ length }, (_, i) => this.normalPdf(i, mean, stddev));
        const adjustedProbs = probs.map((prob, index) => {
            const distance = index - mean;
            return prob * Math.exp(skew * distance);
        });
        const total = adjustedProbs.reduce((acc, prob) => acc + prob, 0);
        return adjustedProbs.map((prob) => prob / total);
    }

    public getNextQuestionDifficulty(currentChapterDifficulties: number[]) {
        // const difficulties = [1, 2, 3, 4, 5];
        const difficulties: number[] = currentChapterDifficulties;
        const meanIndex = gameController.gameStateManager.bkt.masteryProbability * (difficulties.length - 1);
        const stddev = 1.0; // Adjust to control spread
        const skew = -0.5; // Negative for left skew (flatter on the right) => makes more difficult questions more unlikely

        const probabilities = this.getSkewedProbabilities(difficulties.length, meanIndex, stddev, skew);

        let random = Math.random();
        let sum = 0;

        for (let i = 0; i < probabilities.length; i++) {
            sum += probabilities[i];
            if (random < sum) {
                return difficulties[i];
            }
        }

        return difficulties[difficulties.length - 1];
    }

    public calcAndUpdateMasteryProbability(answerCorrect: boolean) {
        let newP_L: number;

        const P_L = gameController.gameStateManager.bkt.masteryProbability;
        const P_S = gameController.gameStateManager.bkt.slipProbability;
        const P_G = gameController.gameStateManager.bkt.guessProbability;
        const P_T = gameController.gameStateManager.bkt.transitionProbability;

        if (answerCorrect) {
            // Update probability of mastery if the answer is correct
            newP_L = (P_L * (1 - P_S)) / (P_L * (1 - P_S) + (1 - P_L) * P_G);
        } else {
            // Update probability of mastery if the answer is incorrect
            newP_L = (P_L * P_S) / (P_L * P_S + (1 - P_L) * (1 - P_G));
        }
        // Update probability of mastery to include transition probability
        newP_L = P_L + (1 - P_L) * P_T;

        gameController.gameStateManager.updateBktMasteryProbability(newP_L);
    }
}
