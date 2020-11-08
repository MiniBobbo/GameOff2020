import { IH } from "../IH/IH";
import { GameScene } from "../scenes/GameScene";

export class TextBox extends Phaser.GameObjects.Container {
    text:Phaser.GameObjects.BitmapText;
    MAX_WIDTH:number = 34;
    ih:IH;
    scene:Phaser.Scene;
    enabled:boolean = true;

    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene);
        scene.add.existing(this);
        let g = scene.add.graphics({
            x:0,
            y:0,
        });
        g.fillStyle(0x000000, .8);
        g.lineStyle(1,0x0000ff);

        g.fillRect(0,0, 200,60);
        g.strokeRect(1,1,198,58);
        this.add(g);

        this.text = scene.add.bitmapText(4,8,'6px', '');
        this.add(this.text);

        this.width = 200;
        this.height = 60;
        this.scene = scene;
        this.ih = ih;
        
    }

    SetText(message:string) {
        let finalMessage = '';
        let count = 0;
        while(message.length > this.MAX_WIDTH) {
            //Loop backwards from 45 until we find a space.
            let breakPoint = this.MAX_WIDTH;
            for(let i = this.MAX_WIDTH; i >= 0; i--) {
                if(message.charAt(i) == ' ') {
                    breakPoint = i; 
                    break;
                }
            }
            let ss = message.substring(0,breakPoint);
            message = message.substring(breakPoint+1,message.length);
            finalMessage += ss + '\n';
        }
        finalMessage += message;

        this.text.setText(finalMessage);
    }

    /**
     * Moves this textbox above something.
     * @param e Anything with an X and Y property.
     */
    MoveAbove(e:{x:number, y:number}) {
        let gs = this.scene as GameScene;
        this.setPosition(e.x - this.width/2, e.y - this.height - 30);
        this.x = Phaser.Math.Clamp(this.x, 0, gs.mg.width - this.width);
        this.y = Phaser.Math.Clamp(this.y, 0, gs.mg.height - this.height);
    }
}