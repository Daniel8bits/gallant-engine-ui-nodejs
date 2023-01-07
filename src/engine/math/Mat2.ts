import Mat from './Mat';
import {Tuple} from './MathTypes'

import {mult, equals, transpose} from './math'

class Mat2 extends Mat {

    public constructor(
        matrix: 
        [
            number, number, 
            number, number
        ] 
        = [
            1, 0,
            0, 1
        ]
        ) {
        super(matrix);
    }

    protected $validate(index: Tuple<[number, number]>) : void | never {
        if(!(index[0] >= 0 && index[0] <= 1 && index[1] >= 0 && index[1] <= 1)) {
            throw new Error("Matrix2x2 index out of bounds! (Min: 0, Max: 1)");
        }
    }

    public equals(m: Mat2): boolean {
        return equals(
            3, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number) => m.get([x, y])
        );
    }

    public transpose(): Mat2 {
        const matrix = new Mat2();

        transpose(
            3, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number, v: number) => matrix.set([x, y], v),
        )

        return matrix;
    }

    public mult(m: Mat2): Mat2 {
        const matrix = new Mat2();

        mult(
            3, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number) => m.get([x, y]),
            (x: number, y: number, v: number) => matrix.set([x, y], v),
        )

        return matrix;
    }


}

export default Mat2;