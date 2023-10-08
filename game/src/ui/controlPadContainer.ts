import { gameController } from "../main";

export default class ControlPadContainer {
    private container: Phaser.GameObjects.Container;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.container = this.scene.add.container(0, 0); // You can set initial x, y coordinates here
        this.create();
    }

    private createButton(x: number, y: number, texture: string, state: Record<string, boolean>, stateKey: string): void {
        const button = this.scene.add.image(x, y, texture)
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => {
                state[stateKey] = true;
            })
            .on('pointerup', () => {
                state[stateKey] = false;
            })
            .on('pointerout', () => {
                state[stateKey] = false;
            });

        this.container.add(button);
    }

    private create(): void {
        this.createButton(-200, 0, "arrowLeft", gameController.buttonStates, "leftPress");
        this.createButton(200, 0, "arrowRight", gameController.buttonStates, "rightPress");
        this.createButton(0, -200, "arrowUp", gameController.buttonStates, "upPress");
        this.createButton(0, 0, "arrowDown", gameController.buttonStates, "downPress");
    }

    public setPosition(x: number, y: number): void {
        this.container.setPosition(x, y);
    }
}
