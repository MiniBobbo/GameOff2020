import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { PlayerGround } from "../FSM/PlayerGround";
import { PlayerAir } from "../FSM/PlayerAir";
import { PlayerAttack } from "../FSM/PlayerAttack";
import { PlayerGoToGround } from "../FSM/PlayerGoToGround";
import { PlayerClimb } from "../FSM/PlayerClimb";

export class Player extends Entity {
    holdingLight:boolean = true;
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        this.hp = 5;
        this.maxhp = 5;
        this.flashTime = 1000;
        this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(12,15);
        this.sprite.name = 'player';
        this.sprite.setGravityY(C.GRAVITY);
        this.sprite.setDepth(5);
        this.PlayAnimation('run');
        this.fsm.addModule('ground', new PlayerGround(this));
        this.fsm.addModule('air', new PlayerAir(this));
        this.fsm.addModule('attack', new PlayerAttack(this));
        this.fsm.addModule('climb', new PlayerClimb(this));
        this.fsm.addModule('gotoground', new PlayerGoToGround(this));
        this.fsm.changeModule('air');
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }


}