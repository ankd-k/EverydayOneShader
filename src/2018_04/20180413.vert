/*{
  "vertexCount": 80000,
  "vertexMode": "POINTS",
  "glslify": true,
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

varying vec4 v_color;

#define PI 3.14159265359

#pragma glslify: rand = require(../utils/rand1D.frag)
#pragma glslify: random = require(../utils/rand2D.frag)

float ease_in(float x){
  return pow(x, 5.0);
}
float ease_out(float x){
  return 1.0-pow(1.0-x, 5.0);
}
float ease_inout(float x){
  float x2 = x*2.0;
  float ret = 0.;
  if(x2<1.0){
    ret = ease_in(x2)*0.5;
  }else{
    ret = 0.5*(1.0+ease_out(x2-1.0));
  }
  return ret;
}

// mvpMatrix
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

//



vec3 cube(float seed, vec3 offset, vec3 r){
  vec3 p = vec3(0.);
  p.x = random(vec2(vertexId*0.2, seed));
  p.y = random(vec2(vertexId*0.3, seed));
  p.z = random(vec2(vertexId*0.4, seed));
  p = p*2.0-1.0;
  p += offset;
  p *= r;
  return p;
}

void main(){
  float t = mod(time, 60.);
  float tf = fract(t);
  float tl = floor(t);
  float n = mod(vertexId, 3.0);

  vec3 p = vec3(0.);
  if(n<1.){// left cube
    p = cube(vertexId, vec3(-4.,0.,0.), vec3(1.));
  }else if(n<2.){// center sphere
    p = cube(vertexId, vec3(0.,0.,0.), vec3(1.));
  }else{// right box
    p = cube(vertexId, vec3(4.,0.,0.), vec3(1.));
  }

  vec3 camEye = vec3(sin(t*0.3)*0.2, sin(t*0.5)*0.05, cos(t*0.3)*0.2);
  vec3 camTarget = vec3(0., 0., 0.);
  vec3 camUp = vec3(0., 1., 0.);

  mat4 mvpMatrix =
									pMatrix(PI/3., resolution.x/resolution.y, 0.001, 2.0)*
                  vMatrix(camEye, camTarget, camUp)*
                  // mMatrix(vec3(0.0,0.0,0.), vec3(-t*0.7, t*0.5, -t), vec3(0.1));
                  mMatrix(vec3(0.), vec3(0.), vec3(0.05));


  gl_Position = mvpMatrix * vec4(p, 1.);
  gl_PointSize = rand(vertexId)*1.;
  v_color = vec4(1.);
}
