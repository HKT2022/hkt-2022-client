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

export class Bootstrapper extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;
        
        const colideTilemapChunkRenderer = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideMap = new PrefabRef<GridObjectCollideMap>();
        const player = new PrefabRef<GameObject>();
        const gridPointer = new PrefabRef<GridPointer>();

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab('sans_fight_room', SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(colideTilemapChunkRenderer)
                .getGridObjectCollideMapRef(collideMap).make())
            
            .withChild(instantiater.buildPrefab('player', PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(colideTilemapChunkRenderer)
                .withGridPosition(new PrefabRef(new Vector2(0, -1)))
                .withPathfindPointer(gridPointer).make()
                .getGameObject(player))
                
            .withChild(instantiater.buildPrefab('grid_input', GridInputPrefab, new Vector3(0, 0, -500000))
                .withCollideMap(colideTilemapChunkRenderer)
                .withCollideMap(collideMap)
                .getGridPointer(gridPointer).make())
                
            .withChild(instantiater.buildPrefab('camera', CameraPrefab)
                .withTrackTarget(player).make())
        ;
    }
}
