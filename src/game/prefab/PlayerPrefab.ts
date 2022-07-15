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
import HeewonSpriteAtlasDamaged1 from '../asset/HeewonDamaged.png';
import HeewonSpriteAtlasDamaged2 from '../asset/HeewonDamaged2.png';
import HeewonSpriteAtlasDamaged3 from '../asset/HeewonDamaged3.png';
import { HealthState, PlayerStatusRenderController } from '../script/PlayerStatusRenderController';
import { PlayerGridMovementController } from '../script/PlayerGridMovementController';
import { RandomBehaviorMaker } from '../script/RandomBehaviorMaker';

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

        const playerStatusRenderController = new PrefabRef<PlayerStatusRenderController>();

        const playerRenderer = new PrefabRef<CssSpriteAtlasRenderer>();
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
            .getComponent(CssSpriteAtlasRenderer, playerRenderer)

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
                c.setPlayerRenderer(playerRenderer.ref!);
                c.setPlayerSprites([
                    HeewonSpriteAtlas,
                    HeewonSpriteAtlasDamaged1,
                    HeewonSpriteAtlasDamaged2,
                    HeewonSpriteAtlasDamaged3
                ]);
            })
            .getComponent(PlayerStatusRenderController, playerStatusRenderController)

            .withComponent(RandomBehaviorMaker, c => {
                c.randomChatHealth1Set = [
                    '좋은 하루!',
                    '할 일 잘 하고 있지!?',
                    '항상 고마워!',
                    '기분 좋은 날이야 !',
                    '화이팅!'
                ];
                c.randomChatHealth2Set = [
                    '조금 힘들데,,',
                    '할 일 잘 하는거 맞아..?',
                    '열심히 하는거지..?',
                    '힘 좀 내봐..'

                ];
                c.randomChatHealth3Set = [
                    '야.. 살아는 있는거지',
                    '지금 하는건 있어???',
                    '너 친구 없지??',
                    '너 때문에 내가,,,'
                ];
                c.randomChatHealth4Set = [
                    '너무 고통스러워...',
                    '나를 왜 만든거야??',
                    '그냥 나를 지워줘..',
                    '개자식!',
                    '누가 내 머리에 평탄화 작업을 한거야??'
                ];

                c.setPlayerStatusRenderController(playerStatusRenderController.ref!);
            })

            .withChild(instantlater.buildGameObject('chatbox',
                new Vector3(0, 1.7, 0),
                new Quaternion(),
                new Vector3(0.1, 0.1, 0.1))
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
                new Vector3(0, -0.7, 0),
                new Quaternion(),
                new Vector3(0.3, 0.3, 0.3))
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
