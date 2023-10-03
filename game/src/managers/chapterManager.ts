import ApiHelper from "../helpers/apiHelper";
import {gameController} from "../main";

export type ChapterType = {
    id:number,
    name:string,
    material: string,
    curriculum_id: number,
    order_position: number
}

export default class ChapterManager {
    private _chapters: ChapterType[] = [];

    private apiHelper = new ApiHelper();

    get chapters(): ChapterType[] {
        return this._chapters;
    }

    public getChapter(id:number){
        return this._chapters.find(chapter => chapter.id == id);
    }

    public updateChapters() {
        return new Promise((resolve, reject)=> {
            if(!this._chapters.find(chapter => chapter.order_position == gameController.gameStateManager.user.chapterNumber)){

                this.apiHelper.getChapters().then((chapters:[]) => {
                    this._chapters = chapters.filter((chapter:ChapterType) => chapter.order_position <= gameController.gameStateManager.user.chapterNumber);
                    resolve(this._chapters)
                }).catch(error => reject(error))
            }else{
                resolve(this._chapters)
            }
        })
    }

    constructor() {
        this.updateChapters().catch(error => console.error(error));
    }
}