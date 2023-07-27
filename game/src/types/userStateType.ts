export type UserStateType = {
    newChapter: boolean;
    answeredQuestionIds: number[],
    chapterNumber: number,
    performanceIndex: number
    repairedObjectsThisChapter: number,
    selectedHat: string,
    unlockedHats: string[],
}