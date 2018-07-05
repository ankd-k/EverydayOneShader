/*{
	"pixelRatio": 0.5,
  "vertexCount": 500000.,
  "vertexMode": "POINTS",

  "glslify": true,
  "keyboard": true,
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;
varying vec4 v_color;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define PI 3.14159265359

float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 rand2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}
float noise(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);

	vec2 u = f * f * f * (10.0 + f * (-15.0 + 6.0 * f));

	return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
									 dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
							mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
									 dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
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
mat4 rotate(vec3 angle){
  return rotateZ(angle.z)*rotateX(angle.x)*rotateY(angle.y);
}
mat4 rotate(vec3 v, float theta){
  mat3 R = mat3(
      0., -v.z, v.y,
      v.z, 0., -v.x,
      -v.y, v.x, 0.
    );
  mat3 I = mat3(1., 0., 0., 0., 1., 0., 0., 0., 1.);
  mat3 M = I+sin(theta)*R+(1.-cos(theta))*R*R;
  return mat4(
      M[0][0], M[0][1], M[0][2], 0.,
      M[1][0], M[1][1], M[1][2], 0.,
      M[2][0], M[2][1], M[2][2], 0.,
      0.,0.,0.,1.
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
  mat4 rot = rotate(angle);

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


// float random(vec2 n) {
// 	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
// }
vec3 rand3(float _seed){
  return vec3(//0.);
      rand(vec2(_seed*0.1, 0.)),
      rand(vec2(_seed*0.2, 0.)),
      rand(vec2(_seed*0.3, 0.))
    );
}
vec3 noise3(float _seed){
  return vec3(//0.);
      noise(vec2(_seed*0.1, 0.)),
      noise(vec2(_seed*0.2, 0.)),
      noise(vec2(_seed*0.3, 0.))
    );
}

// shape
vec3 sphere(float _seed, vec3 _offset, float _r){
  float r = _r;// * random(vec2(vertexId*0.1, _seed));
  float theta = 4.0*PI * rand(vec2(vertexId*0.2, _seed));//*rand(_seed);
  float phi = PI * rand(vec2(vertexId*0.3, _seed)) - 0.5*PI;

  vec3 pos = vec3(0.);
  pos.x = cos(phi) * sin(theta);
  pos.y = sin(phi);
  pos.z = cos(phi) * cos(theta);
  pos *= _r;
  pos += _offset;

  return pos;
}
vec3 cube(float _seed, vec3 _offset, vec3 _r){
  vec3 p = rand3(_seed);
  p.x = rand(vec2(vertexId*0.2, _seed));
  p.y = rand(vec2(vertexId*0.3, _seed));
  p.z = rand(vec2(vertexId*0.4, _seed));
  p = p*2.0-1.0;

  float i = mod(vertexId, 3.);
  if(i<1.){
    if(p.x<0.)p.x = -1.;
    else p.x = 1.;
    if(p.y<0.)p.y = -1.;
    else p.y = 1.;
  }else if(i<2.){
    if(p.y<0.)p.y = -1.;
    else p.y = 1.;
    if(p.z<0.)p.z = -1.;
    else p.z = 1.;
  }else{
    if(p.x<0.)p.x = -1.;
    else p.x = 1.;
    if(p.z<0.)p.z = -1.;
    else p.z = 1.;
  }

  p *= _r;
  p += _offset;
  return p;
}

float interporate(float x){
  return 1.0-pow(1.0-x, 5.);
}



void main(){
  // setup
  float t = mod(time*0.5, 600.);
  float tr = fract(t);
  float tl = floor(t);
  float tlmod2 = mod(tl, 2.);

  // position
  float num = 10.;
  float id = floor(mod(vertexId, num));
  vec3 center = rand3(id)+noise3(id+t);
  center = center*2.0-1.0;
  // if(texture2D(key, vec2(32./256.)).r>0.) center = vec3(0.);
  // if(id<1.)center = vec3(0.);
  // else center = vec3(rand(vec2(id, 0.)),0.,0.);
  vec3 angle = noise3(id+t);
  vec3 pos1, pos2;
  if(mod(tl,2.)<1.){
    pos1 = sphere(tl, center, .2);
    pos2 = cube(tl+1., center, vec3(.2));
  }else{
    pos2 = sphere(tl, center, .2);
    pos1 = cube(tl+1., center, vec3(.2));
  }
  float pct = tr;//interporate(tr);
  vec3 pos = (1.-pct)*pos1 + pct*pos2;

  // camera
  vec3 camEye = vec3(cos(t*0.3), sin(t*0.1)*0.1, sin(t*0.2));
  vec3 camTarget = vec3(0.);
  vec3 camUp = vec3(0.,1.,0.);

  // render
  mat4 mvpMatrix =
                  pMatrix(PI/3., resolution.x/resolution.y, 0.001, 10.)*
                  vMatrix(camEye, camTarget, camUp)*
                  mMatrix(vec3(0.), angle, vec3(1.));

  gl_Position = mvpMatrix * vec4(pos, 1.);
  gl_PointSize = 2.;
  v_color = vec4(1.);

}
