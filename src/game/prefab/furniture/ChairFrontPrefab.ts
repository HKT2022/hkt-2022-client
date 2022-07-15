import { GridCollider } from 'the-world-engine';
import { FurniturePrefab } from './FurniturePrefab';
import ChairFront from '../../asset/furniture/Chair/Chair1/chair.png';

export class ChairFrontPrefab extends FurniturePrefab {
    protected readonly imagePath = ChairFront;
    protected readonly imageWidth = 1;
    protected readonly imageHeight = 1;
    protected readonly colliderBuilder = (c: GridCollider) => {
        c.addColliderFromTwoDimensionalArray([
            [1]
        ], 0, 1);
    };
}
