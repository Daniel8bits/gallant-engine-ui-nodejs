
/* eslint-disable */
export var gl : WebGLRenderingContext = null;

class GLUtils {

    public static init(canvas?: HTMLCanvasElement): HTMLCanvasElement {
        if(!canvas) {
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            document.body.appendChild(canvas);
        }
        gl = canvas.getContext('webgl');
        if(gl === undefined) {
            throw new Error('Unable to initialize WebGL!');
        }

        return canvas;
    }

    public static drawByIndices(iboLength: number) {
        gl.drawElements(gl.TRIANGLES, iboLength, gl.UNSIGNED_SHORT, 0);
    }

    public static draw(vaoLength: number) {
        gl.drawArrays(gl.TRIANGLES, 0, vaoLength);
    }

}

export default GLUtils;
