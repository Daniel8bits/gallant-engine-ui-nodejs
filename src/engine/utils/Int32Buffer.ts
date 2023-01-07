
class Int32Buffer extends ArrayBuffer {


    /**
     * Put an array of Int32 values within the buffer
     */
    public put(data: Int32Array): void {
        const dataView = new DataView(this);
        for(let i = 0; i  < data.length; i++) {
            if(i === this.byteLength) break;
            dataView.setInt32(i, data[i]);
        }
    }
}

export default Int32Buffer;