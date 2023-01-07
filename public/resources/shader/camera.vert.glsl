attribute vec3 a_position;
attribute vec3 a_normal;

varying vec4 v_color;

uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {

    v_color = vec4(normalize(a_normal + vec3(0.0, 0.0, 1.0))+vec3(0.12, 0.12, 1.0), 1.0);
    
    gl_Position = u_projection * u_view * u_transform * vec4(a_position, 1.0);
}