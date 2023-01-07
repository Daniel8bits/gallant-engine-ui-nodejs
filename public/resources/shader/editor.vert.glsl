#version 100
precision highp float;

attribute vec3 a_position;

uniform float u_id;

uniform mat4 u_transform;
uniform mat4 u_view;
uniform mat4 u_projection;

varying vec4 v_color;

void main() {

  float red = 0.0;
  float green = 0.0;
  float blue = 0.0;

  if( u_id < 256.0 ) {
    blue = u_id;
  }
  else if(u_id < pow(256.0, 2.0)) {
    green = floor(u_id/256.0);
    blue = u_id - green*256.0;
  }
  else {
    red = floor(u_id/pow(256.0, 2.0));
    green = floor((u_id-red*pow(256.0, 2.0))/256.0);
    blue = u_id - green*256.0 - red*pow(256.0, 2.0);
  }

  red /= 256.0;
  green /= 256.0;
  blue /= 256.0;

  v_color = vec4(red, green, blue, 1.0);
  gl_Position = u_projection * u_view * u_transform * vec4(a_position, 1.0);
}