import { gl } from "../gl/GLUtils";
import GameCore from "./GameCore";
import InputManager from "./InputManager";

class GameLoop {

    private _gameCore: GameCore;
    private _then: number

    public constructor(gameCore: GameCore) {
        this._gameCore = gameCore;
        this._then = 0
    }

    private loop = (time: number) : void => {

        time *= 0.001;  // seconds;
        const delta = time - this._then;
        this._then = time;
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        InputManager.update()
        this._gameCore.update(time, delta);
        this._gameCore.render();
        requestAnimationFrame(this.loop);
    }

    public start() : void {
        this._gameCore.start();
        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
         gl.enable(gl.CULL_FACE)
        // gl.frontFace(gl.CW)
        gl.depthFunc(gl.LESS)
        this.loop(0);
    }

}

export default GameLoop;