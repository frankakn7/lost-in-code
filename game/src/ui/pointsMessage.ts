export default class PointsMessage extends Phaser.GameObjects.Text {
    readonly _initialLifespan: number = 60;
    private _lifespan = this._initialLifespan; //Frames before disappearing
    private _moveAmount: number = 0.2; // Initial move amount

    static _textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: "5px",
        fontFamily: "forwardRegular",
        // color: "#00c8ff",
        // color: "#f54747",
        color: "#00ff7b",
        align: "center",
        resolution: 10,
    };

    constructor(scene: Phaser.Scene, x: number, y: number, points: number) {
        super(scene, x, y, `+ ${points} points`, PointsMessage._textStyle);
        this.setOrigin(0.5, 0);
    }

    private easeInCubic(x: number): number {
        return x * x * x;
    }

    private easeInSine(x: number): number {
        return 1 - Math.cos((x * Math.PI) / 2);
    }

    preUpdate(time: number, delta: number) {
        const deltaTimeFactor = delta / (1000 / 60);

        let progress = (this._initialLifespan - this._lifespan) / this._initialLifespan;
        this.y -= this._moveAmount * this.easeInSine(1 - progress) * 2 * deltaTimeFactor;
        let startFadeAt = 0.75;
        if (progress >= startFadeAt) {
            let normalizedProgress = (progress - startFadeAt) / (1 - startFadeAt);
            this.alpha = this.easeInSine(1 - normalizedProgress) * deltaTimeFactor;
        }

        // this._lifespan--;
        this._lifespan -= deltaTimeFactor;
        if (this._lifespan <= 0) {
            this.destroy();
        }
    }
}
