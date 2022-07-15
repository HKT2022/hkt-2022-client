import { GridCollider } from 'the-world-engine';
import { FurniturePrefab } from './FurniturePrefab';
import ChairBack from '../../asset/furniture/Chair/Chair1/chair(back).png';

export class ChairBackPrefab extends FurniturePrefab {
    protected readonly imagePath = ChairBack;
    protected readonly imageWidth = 1;
    protected readonly imageHeight = 1;
    protected readonly colliderBuilder = (c: GridCollider) => {
        c.addColliderFromTwoDimensionalArray([
            [1]
        ], 0, 1);
    };
}
