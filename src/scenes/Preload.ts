import { IH } from "../IH/IH";

export class Preload extends Phaser.Scene {
    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value:any) {
            //@ts-ignore
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file:any) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            //@ts-ignore
            this.scene.start('game');
        }, this);
    
        this.load.setBaseURL('./assets/')
        this.load.image('mapts', 'tiles.png');
        this.load.tilemapTiledJSON("testlevel", "testlevel.json");
        this.load.bitmapFont('6px', 'munro_0.png', 'munro.fnt');
        this.load.multiatlas('atlas', 'atlas.json');

        // this.load.audio('fire', './sounds/fire_loop.wav', {loop:true, volume:.5});
        
    }


    create() {
        IH.AddVirtualInput('up');
        IH.AddVirtualInput('down');
        IH.AddVirtualInput('left');
        IH.AddVirtualInput('right');
        IH.AddVirtualInput('jump');
        IH.AddVirtualInput('throw');
        IH.AddVirtualInput('attack');

        IH.AssignKeyToVirtualInput('UP', 'up');
        IH.AssignKeyToVirtualInput('DOWN', 'down');
        IH.AssignKeyToVirtualInput('LEFT', 'left');
        IH.AssignKeyToVirtualInput('RIGHT', 'right');
        IH.AssignKeyToVirtualInput('W', 'up');
        IH.AssignKeyToVirtualInput('S', 'down');
        IH.AssignKeyToVirtualInput('A', 'left');
        IH.AssignKeyToVirtualInput('D', 'right');
        IH.AssignKeyToVirtualInput('Z', 'jump');
        IH.AssignKeyToVirtualInput('L', 'jump');
        IH.AssignKeyToVirtualInput('K', 'attack');
        IH.AssignKeyToVirtualInput('X', 'attack');
        IH.AssignKeyToVirtualInput('O', 'throw');

        this.anims.create({ key: 'player_stand', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_stand_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'player_run', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_run_', end: 7}), repeat: -1 });
        this.anims.create({ key: 'player_jumpup', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpup_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'player_jumpdown', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpdown_', end: 3}), repeat: 0 });

    }
}