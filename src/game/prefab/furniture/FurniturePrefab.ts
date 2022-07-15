import { Vector2 } from 'three/src/Three';
import { CssSpriteRenderer, GameObjectBuilder, GridCollider, GridObjectCollideMap, Prefab, PrefabRef, ZaxisSorter } from 'the-world-engine';

export abstract class FurniturePrefab extends Prefab {
    protected abstract readonly imagePath: string;
    protected abstract readonly imageWidth: number;
    protected abstract readonly imageHeight: number;
    protected abstract readonly colliderBuilder: (c: GridCollider) => void;

    private _gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();

    public withGridObjectCollideMap(map: PrefabRef<GridObjectCollideMap>): this {
        this._gridObjectCollideMap = map;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssSpriteRenderer, c => {
                c.asyncSetImageFromPath(this.imagePath);
                c.centerOffset = new Vector2(0.5, 0.7);
                c.pointerEvents = true;
                c.imageWidth = this.imageWidth;
                c.imageHeight = this.imageHeight;
                c.viewScale = 1;
            })
            .withComponent(GridCollider, c => {
                this.colliderBuilder(c);
                c.gridObjectCollideMap = this._gridObjectCollideMap.ref!;
            })
            .withComponent(ZaxisSorter)
        ;
    }
}
