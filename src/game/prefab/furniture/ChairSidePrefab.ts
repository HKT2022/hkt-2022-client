import { GridCollider } from 'the-world-engine';
import { FurniturePrefab } from './FurniturePrefab';
import ChairSide from '../../asset/furniture/Chair/Chair1/chair(L&R).png';

export class ChairSidePrefab extends FurniturePrefab {
    protected readonly imagePath = ChairSide;
    protected readonly imageWidth = 1;
    protected readonly imageHeight = 1;
    protected readonly colliderBuilder = (c: GridCollider) => {
        c.addColliderFromTwoDimensionalArray([
            [1]
        ], 0, 1);
    };
}
