
class Float32Buffer extends ArrayBuffer {

    public readonly valueOffset: number = 4;

    public constructor (length: number) {
        super(length*4);
    }

    /**
     * Put an array of Float32 values within the buffer
     */
    public put(data: Float32Array): void {
        const dataView = new DataView(this);
        // 'i' refers to the data index, not the byte
        for(let i = 0; i  < data.length; i++) {
            if(i*this.valueOffset >= this.byteLength) break;
            // in order to reference the byte index, 'i' must be multiplied 
            // by the buffer valueOffset
            dataView.setInt32(i*this.valueOffset, data[i]);
        }
    }

    /**
     * Returns the buffer size regarding the value type
     * @returns 
     */
    public getLength(): number {
        return this.byteLength * this.valueOffset;
    }
}

export default Float32Buffer;