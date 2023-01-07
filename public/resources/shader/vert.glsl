attribute vec3 a_position;
attribute vec3 a_normal;
//attribute vec4 a_color;

varying vec3 v_surfaceNormal;
varying vec3 v_vertexToCamera;
varying vec4 v_color;

uniform mat4 u_lookAt;
uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {

    vec4 finalPosition = u_projection * u_view * u_transform * vec4(a_position, 1.0);

    vec4 vertexWorldPosition = u_transform * vec4(a_position, 1.0);

    v_surfaceNormal = (u_transform * vec4(a_normal, 0.0)).xyz;
    v_color = vec4(normalize(a_normal), 1);
    v_vertexToCamera = (u_lookAt * vec4(0.0, 0.0, 0.0, 1.0)).xyz - vertexWorldPosition.xyz;
    
    gl_Position = finalPosition;
}