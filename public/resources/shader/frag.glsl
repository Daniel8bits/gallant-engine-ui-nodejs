precision mediump float;

varying vec3 v_surfaceNormal;
varying vec3 v_vertexToCamera;
varying vec4 v_color;

uniform int u_selected;

void main() {

    vec4 finalColor = v_color;

    if(u_selected == 1){
        //finalColor = vec4(normalize(finalColor.xyz + vec3(1, 0.0, 0.0)), 1.0);
        finalColor = mix(vec4(1.0, 0.0, 0.0, 1.0), finalColor, .5) + vec4(0.1, 0.0, 0.0, 0.0);
    } else {
        finalColor = mix(vec4(0.0, 0.0, 1.0, 1.0), finalColor, .5) + vec4(0.0, 0.0, 0.1, 0.0);
    }

    gl_FragColor = finalColor;
}