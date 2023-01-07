import OBJFile from 'obj-file-parser'
import VAO from '../buffer/VAO'
import VBO from '../buffer/VBO';
import FileUtils from '../utils/FileUtils';

class OBJLoader {
    

    public load(pathname: string): VAO {

        let vao = null

        FileUtils.load(
            pathname, 
            function onSuccess(file) {

                const data = new OBJFile(file).parse()

                const indices = []
                const vertices = []
                const normals = []

                console.log(data);

                data.models[0].faces.forEach((face) => {
                    const v0 = face.vertices[0].vertexIndex-1
                    const v1 = face.vertices[1].vertexIndex-1
                    const v2 = face.vertices[2].vertexIndex-1

                    vertices.push(data.models[0].vertices[v0].x)
                    vertices.push(data.models[0].vertices[v0].y)
                    vertices.push(data.models[0].vertices[v0].z)

                    vertices.push(data.models[0].vertices[v1].x)
                    vertices.push(data.models[0].vertices[v1].y)
                    vertices.push(data.models[0].vertices[v1].z)

                    vertices.push(data.models[0].vertices[v2].x)
                    vertices.push(data.models[0].vertices[v2].y)
                    vertices.push(data.models[0].vertices[v2].z)

                    if(
                        data.models[0].vertexNormals && 
                        data.models[0].vertexNormals.length > 0
                    ) {
                        const n0 = face.vertices[0].vertexNormalIndex-1
                        const n1 = face.vertices[1].vertexNormalIndex-1
                        const n2 = face.vertices[2].vertexNormalIndex-1
    
                        normals.push(data.models[0].vertexNormals[n0].x)
                        normals.push(data.models[0].vertexNormals[n1].y)
                        normals.push(data.models[0].vertexNormals[n2].z)
    
                        normals.push(data.models[0].vertexNormals[n0].x)
                        normals.push(data.models[0].vertexNormals[n1].y)
                        normals.push(data.models[0].vertexNormals[n2].z)
    
                        normals.push(data.models[0].vertexNormals[n0].x)
                        normals.push(data.models[0].vertexNormals[n1].y)
                        normals.push(data.models[0].vertexNormals[n2].z)
                    }
                })

/*
                data.models[0].faces.forEach((face) => {
                    indices.push(face.vertices[0].vertexIndex-1)
                    indices.push(face.vertices[1].vertexIndex-1)
                    indices.push(face.vertices[2].vertexIndex-1)
                })

                data.models[0].vertices.forEach(vertex => {
                    vertices.push(vertex.x)
                    vertices.push(vertex.y)
                    vertices.push(vertex.z)
                })

                data.models[0].vertexNormals.forEach((normal, key) => {
                    normals.push(normal.x)
                    normals.push(normal.y)
                    normals.push(normal.z)
                })
*/
                vao = new VAO([
                    new VBO(new Float32Array(vertices), 3, true),
                    new VBO(new Float32Array(normals), 3, true),
                    //new VBO(new Uint16Array(indices), 1, false),
                ])
                
            },
            function onError(err) {
                throw new Error(`Error trying to load object data: ${pathname}.\n ${err}`);
            },
        );

        return vao
    }

}

export default OBJLoader