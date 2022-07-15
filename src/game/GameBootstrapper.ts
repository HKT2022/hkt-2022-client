import { 
    Bootstrapper as BaseBootstrapper,
    CssCollideTilemapChunkRenderer,
    GameObject,
    GridObjectCollideMap,
    GridPointer,
    PrefabRef,
    SceneBuilder
} from 'the-world-engine';
import { Vector2, Vector3 } from 'three/src/Three';
import { CameraPrefab } from './prefab/CameraPrefab';
import { GridInputPrefab } from './prefab/GridInputPrefab';
import { PlayerPrefab } from './prefab/PlayerPrefab';
import { SansFightRoomPrefab } from './prefab/SansFightRoomPrefab';
import { InvokeOnStart } from './script/InvokeOnStart';
import { HealthState, PlayerStatusRenderController } from './script/PlayerStatusRenderController';

export interface IStateInterop {
    setState(state: HealthState): void;
}

export class StateInteropObject implements IStateInterop {
    private _state: HealthState = HealthState.Healthy;
    private _playerStatusRenderController: PlayerStatusRenderController|null = null;

    public setState(healthState: HealthState): void {
        this._state = healthState;
        if (this._playerStatusRenderController) {
            this._playerStatusRenderController.setHealthState(healthState);
        }
    }
    
    public setController(controller: PlayerStatusRenderController): void {
        this._playerStatusRenderController = controller;
        controller.setHealthState(this._state);
    }
}

export class Bootstrapper extends BaseBootstrapper<StateInteropObject> {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;
        
        const colideTilemapChunkRenderer = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideMap = new PrefabRef<GridObjectCollideMap>();
        const player = new PrefabRef<GameObject>();
        const gridPointer = new PrefabRef<GridPointer>();

        const playerStatusRenderController = new PrefabRef<PlayerStatusRenderController>();

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab('sans_fight_room', SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(colideTilemapChunkRenderer)
                .getGridObjectCollideMapRef(collideMap).make())
            
            .withChild(instantiater.buildPrefab('player', PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(colideTilemapChunkRenderer)
                .withGridPosition(new PrefabRef(new Vector2(0, -1)))
                .withPathfindPointer(gridPointer).make()
                .getComponent(PlayerStatusRenderController, playerStatusRenderController)
                .getGameObject(player))
                
            .withChild(instantiater.buildPrefab('grid_input', GridInputPrefab, new Vector3(0, 0, -500000))
                .withCollideMap(colideTilemapChunkRenderer)
                .withCollideMap(collideMap)
                .getGridPointer(gridPointer).make())
                
            .withChild(instantiater.buildPrefab('camera', CameraPrefab)
                .withTrackTarget(player).make())

            .withChild(instantiater.buildGameObject('invoker')
                .withComponent(InvokeOnStart, c => c.invoke = () => {
                    this.interopObject?.setController(playerStatusRenderController.ref!);
                }))
        ;
    }
}
