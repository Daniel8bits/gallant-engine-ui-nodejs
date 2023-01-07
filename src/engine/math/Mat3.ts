import Mat from './Mat';
import {Tuple} from './MathTypes'

import {mult, equals, transpose} from './math'

class Mat3 extends Mat {

    public constructor(
        matrix: 
        [
            number, number, number, 
            number, number, number, 
            number, number, number
        ] 
        = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]
        ) {
        super(matrix);
    }


    protected $validate(index: Tuple<[number, number]>) : void | never {
        if(!(index[0] >= 0 && index[0] <= 2 && index[1] >= 0 && index[1] <= 2)) {
            throw new Error("Matrix3x3 index out of bounds! (Min: 0, Max: 2)");
        }
    }

    public equals(m: Mat3): boolean {
        return equals(
            3, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number) => m.get([x, y])
        );
    }

    public transpose(): Mat3 {
        const matrix = new Mat3();

        transpose(
            3, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number, v: number) => matrix.set([x, y], v),
        )

        return matrix;
    }

    public mult(m: Mat3): Mat3 {
        const matrix = new Mat3();

        mult(
            3, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number) => m.get([x, y]),
            (x: number, y: number, v: number) => matrix.set([x, y], v),
        )

        return matrix;
    }

}

export default Mat3;