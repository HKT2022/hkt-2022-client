import { Component, GridObjectCollideMap, PrefabConstructor, PrefabRef } from 'the-world-engine';
import { Mulberry32 } from './Mulberry32';
import { Vector3 } from 'three/src/Three';
import { FurniturePrefab } from '../prefab/furniture/FurniturePrefab';

export class ObjectSpawner extends Component {
    private readonly _range = 20;

    public objectList: PrefabConstructor[] = [];
    public gridObjectCollideMap: GridObjectCollideMap|null = null;

    private mulberry32 = new Mulberry32(2);

    public awake(): void {
        let nextObjectId = 0;

        for (let i = -this._range; i < this._range; i++) {
            for (let j = -this._range; j < this._range; j++) {
                const distanceFromCenter = Math.sqrt(i * i + j * j);
                const expScaledDistance = Math.exp(-distanceFromCenter / this._range);
                const random = this.mulberry32.next();
                if (random > expScaledDistance) {
                    const builder = (this.engine.instantiater.buildPrefab(
                        `object${nextObjectId++}`,
                        this.objectList[Math.floor(random * this.objectList.length)],
                        new Vector3(i, j, 0)
                    ) as FurniturePrefab);
                    if (this.gridObjectCollideMap) {
                        builder.withGridObjectCollideMap(new PrefabRef(this.gridObjectCollideMap));
                    }

                    this.gameObject.addChildFromBuilder(builder.make());
                }
            }
        }
    }
}
