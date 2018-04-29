/*{
  "glslify": true,

  "pixelRatio": 1.0,
  "vertexCount": 4000.0,
  "vertexMode": "LINE_LOOP",
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

#define PI 3.1415926539

float random(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

mat4 rotateX(float r){
  return mat4(
      1., 0., 0., 0.,
      0., cos(r), -sin(r), 0.,
      0., sin(r), cos(r), 0.,
      0., 0., 0., 1.
    );
}
mat4 rotateY(float r){
  return mat4(
      cos(r), 0., sin(r), 0.,
      0., 1., 0., 0.,
      -sin(r), 0., cos(r), 0.,
      0., 0., 0., 1.
    );
}
mat4 rotateZ(float r){
  return mat4(
      cos(r), -sin(r), 0., 0.,
      sin(r), cos(r), 0., 0.,
      0., 0., 1., 0.,
      0., 0., 0., 1.
    );
}
mat4 mMatrix(vec3 pos, vec3 angle, vec3 scale){
  mat4 translate = mat4(
    1.,0.,0.,pos.x,
    0.,1.,0.,pos.y,
    0.,0.,1.,pos.z,
    0.,0.,0.,1.
  );
  mat4 scaling = mat4(
    scale.x,0.,0.,0.,
    0.,scale.y,0.,0.,
    0.,0.,scale.z,0.,
    0.,0.,0.,1.
  );
  mat4 rot = rotateZ(angle.z)*rotateX(angle.x)*rotateY(angle.y);

  return scaling * rot * translate;
}

mat4 vMatrix(vec3 _eye, vec3 _target, vec3 _up){
  vec3 Z = normalize(_target - _eye);
  vec3 X = normalize(cross(_up, Z));
  vec3 Y = normalize(cross(Z, X));
  return mat4(
      X.x, Y.x, Z.x, 0.,
      X.y, Y.y, Z.y, 0.,
      X.z, Y.z, Z.z, 0.,
      dot(_eye, X), dot(_eye, Y), dot(_eye, Z), 1.
    );
}
mat4 pMatrix(float _fov, float _aspect, float _near, float _far){
  float t = _near * tan(_fov);
  float r = t*_aspect;
  float a,b,c;
  a = r*2.;
  b = t*2.;
  c = _far-_near;
  return mat4(
      2.*_near/a, 0., 0., 0.,
      0., 2.*_near/b, 0., 0.,
      0., 0., -(_far+_near)/c, -1.,
      0., 0., -(2.*_far*_near)/c, 0.
    );
}





void main(){
  float t = mod(time, 60.*2.)*0.8;
  float tFract = fract(t);
  float tFloor = floor(t);

  vec3 vpos;
  float theta = 2.0*PI * random(vec2(vertexId, 0.));
  float phi = PI * random(vec2(vertexId, 1.)) - PI*0.5;
  vpos.x = cos(phi)*cos(theta);
  vpos.y = sin(phi);
  vpos.z = cos(phi)*sin(theta);

  vec3 pos;
  pos = vpos;

  vec3 camEye = vec3(sin(t), sin(t)*0.2, cos(t));
  vec3 camTarget = vec3(0., 0., 0.);
  vec3 camUp = vec3(0., 1., 0.);

  mat4 mvpMatrix =
									pMatrix(PI/4., resolution.x/resolution.y, 0.1, 10.0)*
                  vMatrix(camEye, camTarget, camUp)*
                  mMatrix(vec3(0.), vec3(0.), vec3(1.));
  gl_Position =  mvpMatrix * vec4(pos, 1.);//pMatrix(1., 5.)

  gl_PointSize = 25.*(1.0-gl_Position.z);

  v_color = vec4(vec3(gl_Position.x, gl_Position.y, gl_Position.z), 1.);
	v_color = vec4(vpos, 1.);
}
