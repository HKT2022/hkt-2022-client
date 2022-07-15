import { Vector2, Vector3, Quaternion } from 'three/src/Three';
import {
    CssSpriteAtlasRenderer,
    SpriteAtlasAnimator,
    ZaxisSorter,
    GameObjectBuilder,
    Prefab,
    IGridCollidable,
    PrefabRef,
    GridPointer,
    CssHtmlElementRenderer,
    GameObject,
    CssTextRenderer,
    TextAlign,
    FontWeight
} from 'the-world-engine';
import { MovementAnimationController } from '../script/MovementAnimationController';
import HeewonSpriteAtlas from '../asset/Heewon.png';
import { PlayerStatusRenderController } from '../script/PlayerStatusRenderController';
import { PlayerGridMovementController } from '../script/PlayerGridMovementController';

export class PlayerPrefab extends Prefab {
    private _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private _gridPosition = new PrefabRef<Vector2>();
    private _nameTagString = new PrefabRef<string>();
    private _gridPointer = new PrefabRef<GridPointer>();

    public withCollideMap(colideMap: PrefabRef<IGridCollidable>): PlayerPrefab {
        this._collideMaps.push(colideMap);
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): PlayerPrefab {
        this._gridPosition = gridPosition;
        return this;
    }

    public withNameTag(name: PrefabRef<string>): PlayerPrefab {
        this._nameTagString = name;
        return this;
    }

    public withPathfindPointer(gridPointer: PrefabRef<GridPointer>): PlayerPrefab {
        this._gridPointer = gridPointer;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantlater = this.instantiater;
        
        const chatboxRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
        const chatboxObject: PrefabRef<GameObject> = new PrefabRef();
        const nameTagRenderer: PrefabRef<CssTextRenderer> = new PrefabRef();
        const nameTagObject: PrefabRef<GameObject> = new PrefabRef();

        return this.gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.asyncSetImageFromPath(HeewonSpriteAtlas, 4, 4);
                c.centerOffset = new Vector2(0, 0.4);
                c.pointerEvents = false;
                c.viewScale = 1;
                c.imageWidth = 1;
                c.imageHeight = 2;
            })
            .withComponent(SpriteAtlasAnimator, c => {
                c.addAnimation('down_idle', [0]);
                c.addAnimation('right_idle', [4]);
                c.addAnimation('up_idle', [8]);
                c.addAnimation('left_idle', [12]);
                c.addAnimation('down_walk', [0, 1, 2, 3]);
                c.addAnimation('right_walk', [4, 5, 6, 7]);
                c.addAnimation('up_walk', [8, 9, 10, 11]);
                c.addAnimation('left_walk', [12, 13, 14, 15]);
                c.frameDuration = 0.2;
            })
            .withComponent(PlayerGridMovementController, c => {
                if (1 <= this._collideMaps.length) {
                    if (this._collideMaps[0].ref) {
                        c.setGridInfoFromCollideMap(this._collideMaps[0].ref);
                    }
                }

                for (let i = 0; i < this._collideMaps.length; i++) {
                    if (this._collideMaps[i].ref) {
                        c.addCollideMap(this._collideMaps[i].ref!);
                    }
                }

                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                if (this._gridPointer) c.gridPointer = this._gridPointer.ref;
                c.speed = 5;
            })
            .withComponent(MovementAnimationController)
            .withComponent(ZaxisSorter, c => {
                c.runOnce = false;
                c.offset = 0.1;
            })
            .withComponent(PlayerStatusRenderController, c => {
                c.setChatBoxObject(chatboxObject.ref!);
                c.setChatBoxRenderer(chatboxRenderer.ref!);
                c.setNameTagObject(nameTagObject.ref!);
                c.setNameTagRenderer(nameTagRenderer.ref!);
                c.nameTag = this._nameTagString.ref;
            })

            .withChild(instantlater.buildGameObject('chatbox',
                new Vector3(0, 45, 0),
                new Quaternion(),
                new Vector3(0.5, 0.5, 0.5))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    const chatboxDiv = document.createElement('div');
                    chatboxDiv.style.borderRadius = '15px';
                    chatboxDiv.style.background = '#000000';
                    chatboxDiv.style.color = '#ffffff';
                    chatboxDiv.style.textAlign = 'center';
                    chatboxDiv.style.padding = '5px 10px';
                    chatboxDiv.style.opacity = '0.5';
                    chatboxDiv.style.fontFamily = 'Noto Sans';
                    c.element = chatboxDiv;
                    c.pointerEvents = false;
                })
                .getComponent(CssHtmlElementRenderer, chatboxRenderer)
                .getGameObject(chatboxObject))

            .withChild(instantlater.buildGameObject('nametag',
                new Vector3(0, 32, 0),
                new Quaternion(),
                new Vector3(0.5, 0.5, 0.5))
                .active(false)
                .withComponent(CssTextRenderer, c => {
                    c.textAlign = TextAlign.Center;
                    c.fontWeight = FontWeight.Bold;
                    c.textHeight = 16;
                    c.textWidth = 128;
                    c.fontFamily = 'Noto Sans';
                    c.pointerEvents = false;
                })
                .getComponent(CssTextRenderer, nameTagRenderer)
                .getGameObject(nameTagObject));
    }
}
