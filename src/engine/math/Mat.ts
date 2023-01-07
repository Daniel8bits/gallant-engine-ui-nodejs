import {Tuple} from './MathTypes'

abstract class Mat {

    private _matrix: number[];

    protected constructor(matrix: number[]) {
        this._matrix = matrix;
    }

    public set(index: Tuple<[number, number]>, value: number): void {
        this.$validate(index);
        const range = Math.sqrt(this._matrix.length);
        this._matrix[index[0]*range+index[1]] = value;
    }

    public get(index: Tuple<[number, number]>): number {
        this.$validate(index);
        const range = Math.sqrt(this._matrix.length);
        return this._matrix[index[0]*range+index[1]];
    }

    protected abstract $validate(index: Tuple<[number, number]>) : void | never;

    public getMatrix(): number[] {
        return this._matrix;
    }

    public toArray(): Float32Array {
        return new Float32Array(this._matrix);
    }

}

export default Mat;