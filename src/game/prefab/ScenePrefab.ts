import { Vector2, Vector3 } from 'three/src/Three';
import {
    CssCollideTilemapChunkRenderer,
    CameraRelativeZaxisSorter,
    CssSpriteAtlasRenderer,
    CssIframeRenderer,
    ZaxisSorter,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    GridCollider,
    GridObjectCollideMap
} from 'the-world-engine';
//import SansFightRoomTileAtlas from '../asset/room_sanscorridor.png';
import SansBlack from '../asset/Sans black.png';
import { CssSpriteAtlasRenderMode } from 'the-world-engine/dist/engine/script/render/CssSpriteAtlasRenderer';
import { AirPurifierPrefab } from './furniture/AirPurifierPrefab';
import { ChairFrontPrefab } from './furniture/ChairFrontPrefab';
import { ChairBackPrefab } from './furniture/ChairBackPrefab';
import { ChairSidePrefab } from './furniture/ChairSidePrefab';
import { ObjectSpawner } from '../script/ObjectSpawner';

export class ScenePrefab extends Prefab {
    private _colideTilemapChunkRenderer = new PrefabRef<CssCollideTilemapChunkRenderer>();
    private _gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();

    public getColideTilemapChunkRendererRef(colideTilemapRenderer: PrefabRef<CssCollideTilemapChunkRenderer>): ScenePrefab {
        this._colideTilemapChunkRenderer = colideTilemapRenderer;
        return this;
    }

    public getGridObjectCollideMapRef(gridObjectCollideMap: PrefabRef<GridObjectCollideMap>): ScenePrefab {
        this._gridObjectCollideMap = gridObjectCollideMap;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantiater = this.instantiater;

        return this.gameObjectBuilder
            .withChild(instantiater.buildGameObject('tilemap')
                .withComponent(CameraRelativeZaxisSorter, c => c.offset = -50))

        // .withChild(instantiater.buildGameObject('floor', new Vector3(0, 0, -1))
        //     .withComponent(CssTilemapChunkRenderer, c => {
        //         const tilemap3 = new Image();
        //         tilemap3.src = SansFightRoomTileAtlas;

        //         c.imageSources = [new TileAtlasItem(tilemap3, 3, 20)];
        //         c.pointerEvents = false;
                
        //         tilemap3.onload = () => {
        //             tilemap3.onload = null;
        //             const F = {i:0, a:57};
        //             const G = {i:0, a:58};
        //             const H = {i:0, a:48};
        //             const I = {i:0, a:49};
        //             const J = {i:0, a:52};
        //             const K = {i:0, a:53};
        //             c.drawTileFromTwoDimensionalArray([
        //                 [G, F, G, F, G, F, G, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, G, F, G, F, G, F, G, F],
        //                 [F, G, F, G, F, G, F, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, F, G, F, G, F, G, F, G],
        //                 [G, F, G, F, G, F, G, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, K, J, K, H, I, H, G, F, G, F, G, F, G, F],
        //                 [F, G, F, G, F, G, F, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, J, K, J, I, H, I, F, G, F, G, F, G, F, G],
        //             ], -2, -2);
        //         };
        //     }))

        // .withChild(instantiater.buildGameObject('wall')
        //     .withComponent(CssCollideTilemapChunkRenderer, c => {
        //         const tilemap3 = new Image();
        //         tilemap3.src = SansFightRoomTileAtlas;

        //         c.imageSources = [
        //             new TileAtlasItem(tilemap3, 3, 20)
        //         ];
        //         c.pointerEvents = false;

        //         tilemap3.onload = () => {
        //             tilemap3.onload = null;

        //             const W = {i:0, a:56};
        //             const X = {i:0, a:50};
        //             const Y = {i:0, a:59};
        //             const Z = {i:0, a:40};
        //             const A = {i:0, a:51};
        //             const o = null;
        //             c.drawTileFromTwoDimensionalArray([
        //                 [W, W, W, W, W, W, W, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, X, X, X, o, o, o, W, W, W, W, W, W, W, W,],
        //                 [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
        //                 [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
        //                 [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
        //                 [W, W, W, W, W, W, W, W, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, W, W, W, W, W, W, W, W,],
        //                 [Y, Y, Y, Y, Y, Y, Y, Y, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, A, A, A, Z, Z, Z, W, W, W, W, W, W, W, W,],
        //             ], -2, 2);

        //             const B = {i:0, a:44};
        //             const C = {i:0, a:42};
        //             c.drawTileFromTwoDimensionalArray([
        //                 [o, o, o, o, o, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C, o, B, o, o, o, C]
        //             ], -2, 7);

        //             c.addCollider(-3, 1);
        //             c.addCollider(-3, 0);
        //             c.addCollider(-3, -1);
        //             c.addCollider(-3, -2);
        //             for (let i = -4; i < 58; i++) {
        //                 c.addCollider(i, -3);
        //             }
        //             c.addCollider(58, 1);
        //             c.addCollider(58, 0);
        //             c.addCollider(58, -1);
        //             c.addCollider(58, -2);

        //             [
        //                 {x: 5, y: 1},
        //                 {x: 11, y: 1},
        //                 {x: 17, y: 1},
        //                 {x: 23, y: 1},
        //                 {x: 29, y: 1},
        //                 {x: 35, y: 1},
        //                 {x: 41, y: 1},
        //                 {x: 47, y: 1},
        //             ].forEach(p => {
        //                 c.drawTileFromTwoDimensionalArray([
        //                     [{i: 0, a: 0}, {i: 0, a: 1}, {i: 0, a: 2}],
        //                     [{i: 0, a: 3}, {i: 0, a: 4}, {i: 0, a: 5}],
        //                     [{i: 0, a: 6}, {i: 0, a: 7}, {i: 0, a: 8}],
        //                     [{i: 0, a: 9}, {i: 0, a: 10}, {i: 0, a: 11}],
        //                     [{i: 0, a: 12}, {i: 0, a: 13}, {i: 0, a: 14}],
        //                     [{i: 0, a: 15}, {i: 0, a: 16}, {i: 0, a: 17}],
        //                 ], p.x, p.y);
        //             });

        //             [
        //                 {x: 8, y: 3},
        //                 {x: 14, y: 3},
        //                 {x: 20, y: 3},
        //                 {x: 26, y: 3},
        //                 {x: 32, y: 3},
        //                 {x: 38, y: 3},
        //                 {x: 44, y: 3},
        //             ].forEach(p => {
        //                 c.drawTileFromTwoDimensionalArray([
        //                     [{i: 0, a: 24}, {i: 0, a: 25}, {i: 0, a: 26}],
        //                     [{i: 0, a: 27}, {i: 0, a: 28}, {i: 0, a: 29}],
        //                     [{i: 0, a: 30}, {i: 0, a: 31}, {i: 0, a: 32}],
        //                     [{i: 0, a: 33}, {i: 0, a: 34}, {i: 0, a: 35}],
        //                     [{i: 0, a: 36}, {i: 0, a: 37}, {i: 0, a: 38}],
        //                 ], p.x, p.y);
        //             });
        //         };
        //     })
        //     .getComponent(CssCollideTilemapChunkRenderer, this._colideTilemapChunkRenderer)))

            .withChild(instantiater.buildGameObject('object_collide_map', new Vector3(0.5, 0.5, 0))
                .withComponent(GridObjectCollideMap, c => {
                    c.gridCellHeight = this._colideTilemapChunkRenderer.ref?.gridCellHeight ?? 1;
                    c.gridCellWidth = this._colideTilemapChunkRenderer.ref?.gridCellWidth ?? 1;
                })
                .getComponent(GridObjectCollideMap, this._gridObjectCollideMap))

            .withChild(instantiater.buildGameObject('objects')

                .withChild(instantiater.buildGameObject('iframe', new Vector3(0.5 + 6, 0.5, 0))
                    .withComponent(CssIframeRenderer, c => {
                        c.iframeSource = 'https://www.youtube.com/embed/p9wmCeqB0eA';
                        c.width = 4 * 1;
                        c.height = 2.25 * 1;
                        c.viewScale = 0.01;
                        c.centerOffset = new Vector2(0, 0.5);
                    })
                    .withComponent(ZaxisSorter))

                .withChild(instantiater.buildGameObject('sans', new Vector3(7, -1, 0))
                    .withComponent(CssSpriteAtlasRenderer, c => {
                        c.asyncSetImageFromPath(SansBlack, 4, 4);
                        c.centerOffset = new Vector2(0.5, 0.7);
                        c.pointerEvents = true;
                        c.imageIndex = 12;
                        c.imageWidth = 1;
                        c.imageHeight = 1.375;
                        c.viewScale = 1;
                        c.renderMode = CssSpriteAtlasRenderMode.ObjectFit;
                    })
                    .withComponent(GridCollider, c => {
                        c.addCollider(0, 0);
                        c.gridObjectCollideMap = this._gridObjectCollideMap.ref!;
                    })
                    .withComponent(ZaxisSorter))

                .withChild(instantiater.buildGameObject('spawner')
                    .withComponent(ObjectSpawner, c => {
                        c.gridObjectCollideMap = this._gridObjectCollideMap.ref!;
                        c.objectList = [
                            AirPurifierPrefab,
                            ChairFrontPrefab,
                            ChairBackPrefab,
                            ChairSidePrefab
                        ];
                    })))
        ;
    }
}
