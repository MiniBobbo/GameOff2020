import * as Phaser from "phaser";
import { Preload } from "./scenes/Preload";
import { GameScene } from "./scenes/GameScene";
import { C } from "./C";
import { GameData } from "./GameData";
// import { Preload } from "./scenes/preload";
// import { Boot } from "./scenes/boot";
// import { Game } from "./scenes/game";


class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 480,
      height: 270,
      zoom:2,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true
        }
      },
      // scene:{
      //   // preload:preload,
      //   // game:Game
      // },
      render: {
        pixelArt:true,
      },
    };
    super(config);

    // this.scene.add("boot", Boot, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("game", GameScene, false);
    this.scene.start("preload");
    C.gd = new GameData();
    // C.setFlag('5', true);
    }

}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};