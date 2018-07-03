/*{
  frameskip: 1,
  vertexMode: "TRIANGLES",
  PASSES: [{
    MODEL: {
      PATH: 'deer.obj',
      BLEND : 'ADD',
    },
  }]
}*/
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

attribute float vertexId;
attribute float objectId;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 uvTransform;
uniform float time;
uniform vec2 resolution;

varying vec2 vUv;
varying vec3 v_position;// don't declare
varying vec3 v_normal;// don't declare
varying float vObjectId;
varying vec4 v_color;

vec2 rot(in vec2 p, in float t) {
  float s = sin(t);
  float c = cos(t);
  return mat2(s, c, -c, s) * p;
}

float ease(in float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main() {
  vec3 pos = position;
  pos.y += pos.x<0. ? 0.: -mod(time, 1.);
  // pos.x = clamp(pos.x, sin(pos.y*15.+time)*0.1, 1.);
  pos.xz = rot(pos.xz, time);
  pos.x *= resolution.y / resolution.x;

  // pos *= 1.+usin(vertexId*0.2+time*2.)*0.35;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vUv = uv;
  v_position = position;// don't declare
  v_normal = normal;// don't declare
  vObjectId = objectId;
  v_color = vec4(1.);
}
