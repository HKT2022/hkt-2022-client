import { GridCollider } from 'the-world-engine';
import { FurniturePrefab } from './FurniturePrefab';
import AirPurifier from '../../asset/furniture/Air purifier/Air purifier.png';

export class AirPurifierPrefab extends FurniturePrefab {
    protected readonly imagePath = AirPurifier;
    protected readonly imageWidth = 1;
    protected readonly imageHeight = 1;
    protected readonly colliderBuilder = (c: GridCollider) => {
        c.addColliderFromTwoDimensionalArray([
            [1]
        ], 0, 1);
    };
}
