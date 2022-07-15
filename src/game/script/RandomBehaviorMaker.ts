import { Component, CoroutineIterator, WaitForSeconds } from 'the-world-engine';
import { PlayerGridMovementController } from './PlayerGridMovementController';
import { HealthState, PlayerStatusRenderController } from './PlayerStatusRenderController';

export class RandomBehaviorMaker extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents = [PlayerGridMovementController];

    public randomMovementRange = 4;
    public randomMovementIntervalMin = 10;
    public randomMovementIntervalMax = 20;

    public randomChatRange = 10;

    public randomChatHealth1Set: string[] = [];
    public randomChatHealth2Set: string[] = [];
    public randomChatHealth3Set: string[] = [];
    public randomChatHealth4Set: string[] = [];

    private _playerGridMovementController: PlayerGridMovementController|null = null;
    private _playerStatusRenderController: PlayerStatusRenderController|null = null;

    public setPlayerStatusRenderController(controller: PlayerStatusRenderController): void {
        this._playerStatusRenderController = controller;
    }

    public start(): void {
        this._playerGridMovementController = this.gameObject.getComponent(PlayerGridMovementController);
        this.startCoroutine(this.randomMovement());
        this.startCoroutine(this.randomChat());
    }

    private *randomMovement(): CoroutineIterator {
        for (; ;) {
            const randomMovementInterval = 
                Math.random() * (this.randomMovementIntervalMax - this.randomMovementIntervalMin) + this.randomMovementIntervalMin;
            yield new WaitForSeconds(randomMovementInterval);
            const randomPosition = this._playerGridMovementController!.positionInGrid;
            randomPosition.x += Math.floor(Math.random() * this.randomMovementRange * 2) - this.randomMovementRange;
            randomPosition.y += Math.floor(Math.random() * this.randomMovementRange * 2) - this.randomMovementRange;
            this._playerGridMovementController!.tryStartPathfind(randomPosition);
        }
    }

    private *randomChat(): CoroutineIterator {
        for (; ;) {
            yield new WaitForSeconds(Math.random() * 5 + 5);

            const playerHealthState = this._playerStatusRenderController!.healthState;
            let randomChatSet: string[];
            switch (playerHealthState) {
            case HealthState.Healthy:
                randomChatSet = this.randomChatHealth1Set;
                break;
            case HealthState.Damaged1:
                randomChatSet = this.randomChatHealth2Set;
                break;
            case HealthState.Damaged2:
                randomChatSet = this.randomChatHealth3Set;
                break;
            case HealthState.Damaged3:
                randomChatSet = this.randomChatHealth4Set;
                break;
            }

            const randomChat = randomChatSet[Math.floor(Math.random() * randomChatSet.length)];
            this._playerStatusRenderController!.setChatBoxText(randomChat);
        }
    }
}
