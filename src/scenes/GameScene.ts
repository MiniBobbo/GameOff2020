import { TextBox } from "../entities/TextBox";
import { IH } from "../IH/IH";
import { TravelZone } from "../zones/TravelZone";
import { C } from "../C";
import { EnemyFactory } from "../EnemyFactory";
import { Entity } from "../entities/Entity";
import { MessageText } from "../MessageText";
import { MessageZone } from "../zones/MessageZone";
import { DamageZone } from "../zones/DamageZone";
import { CutsceneZone } from "../zones/CutsceneZone";
import { PowerupZone } from "../zones/PowerupZone";
import { Player } from "../entities/Player";

export class GameScene extends Phaser.Scene {
    e!:Player;
    ih!:IH;
    debugText!:Phaser.GameObjects.BitmapText;
    messageText!:MessageText;
    map!:Phaser.Tilemaps.Tilemap;
    zones!:Array<Phaser.GameObjects.Zone>;
    collideMap!:Array<Phaser.GameObjects.GameObject>;
    enemies!:Array<Phaser.GameObjects.GameObject>;

    effects!:Phaser.GameObjects.Group;
    tb!:TextBox;
    mg!:Phaser.Tilemaps.DynamicTilemapLayer;

    preload() {
        this.ih = new IH(this);

    }

    create() {
        this.zones=[];
        this.collideMap=[];
        this.enemies = [];
        this.map = this.make.tilemap({ key: C.currentLevel });
        const tileset = this.map.addTilesetImage("tiles", "mapts");
        const bg  = this.map.createDynamicLayer("bg", tileset, 0, 0);
        const belowLayer = this.map.createDynamicLayer("mg", tileset, 0, 0);
        belowLayer.setCollisionByProperty({collide:true}, true);
        this.mg = belowLayer;
        this.mg.setDepth(40);

        this.e = new Player(this, this.ih);
        this.e.sprite.setFrame("player_jumpdown_1");
        this.cameras.main.startFollow(this.e.sprite);
        this.cameras.main.setBounds(0,0,belowLayer.width, belowLayer.height);
        this.physics.add.collider(this.collideMap, belowLayer);
        // this.physics.add.overlap(this.e.sprite, this.zones, (sprite:Phaser.Physics.Arcade.Sprite, z:Phaser.GameObjects.Zone) => {
        //     z.emit('overlap', sprite);
            // console.log(`Hit zone ${z.name}`);
        // });

        this.physics.add.overlap(this.e.sprite, this.enemies, (p:any, e:any) => {
            e.emit('hitplayer', p);
        }); 

        this.effects = this.add.group({
            classType:Phaser.GameObjects.Sprite
        });
        
        let prop = this.map.properties as Array<{name:string, type:string, value:any}>;
        // let ambient = prop.find((e:any) =>{return e.name == 'ambient'});

        this.debugText = this.add.bitmapText(2,22, '6px', '')
        .setScrollFactor(0,0);

        this.messageText = new MessageText(this);
        this.messageText.setPosition(200,50);
        this.messageText.setDepth(100);
        // this.messageText.setScrollFactor(0,0);

        // let hb = new HealthBar(this);
        // hb.setDepth(100);

        this.events.on('effect', this.Effect, this);
        this.e.sprite.on('dead', this.PlayerDied, this);
        this.events.on('message', (message:string, x:number, y:number, width:number) => {this.messageText.setPosition(Math.floor(x),Math.floor(y));  this.messageText.message = message; this.messageText.setAlpha(1);}, this);
        this.events.on('shutdown', this.ShutDown, this);
        // this.events.on('debug', (message:string) => {this.debugText.text += message + '\n';}, this);
        this.events.on('travel', () => { this.e.fsm.clearModule(); this.cameras.main.fadeOut(200, 0,0,0,(cam:any, progress:number) => { if(progress == 1) this.scene.restart();}); }, this);
        this.events.on('textbox', (speaker:{x:number, y:number}, message:string) => {
            this.tb.setVisible(true);
            this.tb.SetText(message); 
            this.tb.MoveAbove(speaker); 
        }, this);
        this.events.on('hidetextbox', ()=> {this.tb.setVisible(false);}, this);
        this.input.on('pointerup', (pointer:any) => {
            },this);
        this.CreateZones();

        if(C.previouslevel == 'checkpoint') {
            let c:any = this.map.objects[0].objects.find((o)=> {return o.name == 'checkpoint';});
            c.y -= 16;
            this.e.sprite.setPosition(c.x,c.y);
        } else {
            let c:any = this.map.objects[0].objects.find((o)=> {return o.name == 'd' && o.type == C.previouslevel;});
            // c.y -= 16;
            this.e.sprite.setPosition(c.x,c.y);

        }

        this.tb = new TextBox(this, this.ih);
        this.tb.setVisible(false);
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.fadeIn(300);
        }

    /**
     * remove the listeners of all the events creted in create() or they will fire multiple times.  
     */
    ShutDown() {
        this.events.removeListener('shutdown');
        this.events.removeListener('debug');
        this.events.removeListener('travel');
        this.events.removeListener('effect');
        this.events.removeListener('pointerup');
    }

    Effect(data:{name:string, x:number, y:number}) {
        let e:Phaser.GameObjects.Sprite = this.effects.getFirstDead(true, 100,100,'atlas');
        e.setActive(true);
        e.setDepth(55);
        e.visible = true;
        switch (data.name) {
            default:
                break;
        }

    }

    update(time:number, dt:number) {
        this.debugText.text = '';
        this.ih.update();
        if(this.tb.visible) {
            if(this.ih.IsJustPressed('jump') ||this.ih.IsJustPressed('attack') ) {
                this.tb.setVisible(false);
            }
        }

        if(this.ih.IsJustPressed('event')) {
            // this.events.emit('unlock');
        }

        if(this.messageText.alpha > 0)
            this.messageText.alpha -= .03;
        // if(this.ih.IsJustPressed('attack')) {
        //     let a = this.GetPlayerAttack();
        //     a.LaunchMeleeAttack(this.p, {x:12,y:0}, 'snake_move');
        // }
        // this.p.fsm.update(time, dt);
        this.events.emit('debug', `Effects: ${this.effects.getLength()}`);
        this.events.emit('debug', `P loc: ${Math.floor(this.e.sprite.body.x)},  ${Math.floor(this.e.sprite.body.y)}`);
        this.events.emit('debug', `Mouse loc: ${Math.floor(this.input.mousePointer.worldX)},  ${Math.floor(this.input.mousePointer.worldY)}`);

    }

    CreateZones() {
        this.map.objects[0].objects.forEach((o)=> {
            switch (o.name) {
                case 'travel':
                    let travel = new TravelZone(this, o);
                    this.zones.push(travel);
                    break;
                case 'message':
                    let message = new MessageZone(this, o);
                    this.zones.push(message);
                    break;
                case 'damage':
                    let dz = new DamageZone(this, o);
                    this.zones.push(dz);
                    break;
                case 'powerup':
                    let puz = new PowerupZone(this, o);
                    this.zones.push(puz);
                    break;
                case 'enemy':
                    EnemyFactory.CreateEnemy(this, this.ih, o);
                break;
                case 'cutscene':
                    let c= new CutsceneZone(this, o);
                    this.zones.push(c);
                break;
                default:
                    break;
            }
        });
    }

    GetEnemyAttack():any {
        // let a = this.enemyAttacks.find( (a:BaseAttack) => { return a.sprite.body.enable === false;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.enemyAttacks.push(a);
        // }
        // return a;
    }
        
    GetPlayerAttack(type:string):any {
        // let a = this.playerAttacks.find( (a:Phaser.Physics.Arcade.Sprite) => { return a.body.enable === false && a.name === type;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.playerAttacks.push(a);
        //     this.playerAttackSprites.push(a.sprite)
        // }
        // return a;
    }

    PlayerDied() {

    }
        
}