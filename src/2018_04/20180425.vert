/*{
  "vertexCount": 540000.,
  "vertexMode": "TRIANGLES",


}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 lightPos;
// varying mat4 mvpMatrix;

#define PI 3.14159265359

//---------------------------------------------------------------------------------------------------------------
// mvpMatrix
//---------------------------------------------------------------------------------------------------------------
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

mat4 mvpMatrix(
    vec3 _pos, vec3 _angle, vec3 _scale,
    vec3 _eye, vec3 _target, vec3 _up,
    float _fov, float _aspect, float _near, float _far
  ){
  return pMatrix(_fov, _aspect, _near, _far)*vMatrix(_eye, _target, _up)*mMatrix(_pos, _angle, _scale);
}

//---------------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------------
// noise
//---------------------------------------------------------------------------------------------------------------
// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}
//---------------------------------------------------------------------------------------------------------------


vec3 getPos(float id, float w, float d, float vSegX){
  float x = w * mod(id, vSegX) * 2. -1.;
  float z = d * floor(id/vSegX) * 2. - 1.;
  float y = snoise(vec2(x,z+time*0.5))*0.2;
  // y *= 1.2-length(vec2(x,z));
  return vec3(x,y,z);
}


mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}
mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
              m[0][1], m[1][1], m[2][1], m[3][1],
              m[0][2], m[1][2], m[2][2], m[3][2],
              m[0][3], m[1][3], m[2][3], m[3][3]);
}

float usin(float x){
  return (sin(x)+1.)*.5;
}




vec3 plane(float surfaceCount){
  vec3 pos = vec3(0.);

  vec2 surfaceSeg = vec2(
      floor(sqrt(surfaceCount))
    );
  float surfaceW = 1./(surfaceSeg.x);
  float surfaceD = 1./(surfaceSeg.y);
  vec2 vertexSeg = surfaceSeg+1.;


  float surfaceId = floor(vertexId/6.);
  if(surfaceCount<surfaceId)return vec3(0.);
  surfaceId += floor(surfaceId/surfaceSeg.x);// ☆1行増えると起点が1増える

  // quad coordinate
  float ids[4];
  ids[0] = surfaceId;
  ids[1] = surfaceId+1.;
  ids[2] = surfaceId+1.+vertexSeg.x;
  ids[3] = surfaceId+vertexSeg.x;

  // choose id
  float vertexNum = mod(vertexId, 6.);
  float id = 0.;
  if(vertexNum<1.) id = ids[0];
  else if(vertexNum<2.) id = ids[1];
  else if(vertexNum<4.) id = ids[2];
  else if(vertexNum<5.) id = ids[3];
  else id = ids[0];

  pos = getPos(id,surfaceW,surfaceD,vertexSeg.x);

  vec3 trianglePos[3];
  if(vertexNum<3.){
    trianglePos[0] = getPos(ids[0], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[1] = getPos(ids[1], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[2] = getPos(ids[2], surfaceW, surfaceD, vertexSeg.x);
  }else{
    trianglePos[0] = getPos(ids[2], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[1] = getPos(ids[3], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[2] = getPos(ids[0], surfaceW, surfaceD, vertexSeg.x);
  }
  // for(int i=0;i<3;i++){
  //   trianglePos[i] = getPos(float(vertexNum<3.?i:i+3), surfaceW, surfaceD, vertexSeg.x);
  // }
  vec3 edge1 = trianglePos[1]-trianglePos[0];
  vec3 edge2 = trianglePos[2]-trianglePos[0];
  v_normal = normalize(cross(edge1, edge2));

  return pos;
}



void main(){
  // setup
  float t = mod(time, 60.);
  vec3 pos = vec3(0.);

  // vertex
  float surfaceCount = floor(vertexCount/6.);
  // pos = plane(surfaceCount);
  vec2 surfaceSeg = vec2(
      floor(sqrt(surfaceCount))
    );
  float surfaceW = 1./(surfaceSeg.x);
  float surfaceD = 1./(surfaceSeg.y);
  vec2 vertexSeg = surfaceSeg+1.;


  float surfaceId = floor(vertexId/6.);
  surfaceId += floor(surfaceId/surfaceSeg.x);// ☆1行増えると起点が1増える

  // quad coordinate
  float ids[4];
  ids[0] = surfaceId;
  ids[1] = surfaceId+1.;
  ids[2] = surfaceId+1.+vertexSeg.x;
  ids[3] = surfaceId+vertexSeg.x;

  // choose id
  float vertexNum = mod(vertexId, 6.);
  float id = 0.;
  if(vertexNum<1.) id = ids[0];
  else if(vertexNum<2.) id = ids[1];
  else if(vertexNum<4.) id = ids[2];
  else if(vertexNum<5.) id = ids[3];
  else id = ids[0];

  pos = getPos(id,surfaceW,surfaceD,vertexSeg.x);


  vec3 trianglePos[3];
  if(vertexNum<3.){
    trianglePos[0] = getPos(ids[0], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[1] = getPos(ids[1], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[2] = getPos(ids[2], surfaceW, surfaceD, vertexSeg.x);
  }else{
    trianglePos[0] = getPos(ids[2], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[1] = getPos(ids[3], surfaceW, surfaceD, vertexSeg.x);
    trianglePos[2] = getPos(ids[0], surfaceW, surfaceD, vertexSeg.x);
  }
  // for(int i=0;i<3;i++){
  //   trianglePos[i] = getPos(float(vertexNum<3.?i:i+3), surfaceW, surfaceD, vertexSeg.x);
  // }
  vec3 edge1 = trianglePos[1]-trianglePos[0];
  vec3 edge2 = trianglePos[2]-trianglePos[0];
  v_normal = normalize(cross(edge1, edge2));





  //-------------------------------------------------
  // mvp matrix
  //-------------------------------------------------
  // model matrix
  vec3 modelPos = vec3(0.);
  vec3 modelAngle = vec3(0.,0.,0.);
  vec3 modelScale = vec3(1.);
  mat4 modelMat = mMatrix(modelPos, modelAngle, modelScale);
  mat4 modelInvMat = inverse(modelMat);
  // view matrix
  vec3 viewEye = vec3(0., -1., 2.);
  viewEye = vec3(.8*sin(-t*.3),-1.,.8*cos(-t*.7));
  vec3 viewTarget = vec3(0.);
  vec3 viewUp = vec3(0.,1.,0.);
  mat4 viewMat = vMatrix(viewEye, viewTarget, viewUp);
  // projection matrix
  float projectionFov = PI/6.;
  float projectionAspect = resolution.x/resolution.y;
  float projectionNear = 0.01;
  float projectionFar = 10.0;
  mat4 projectionMat = pMatrix(projectionFov, projectionAspect, projectionNear, projectionFar);

  mat4 mvp = projectionMat*viewMat*modelMat;
  //-------------------------------------------------

  gl_Position = mvp * vec4(pos, 1.);
  gl_PointSize = 1.;

  //--------------------------------------------------------------------------
  // Lighting
  //--------------------------------------------------------------------------
  vec3 surfaceColor = vec3(1.);
  v_color = vec4(vec3(0.), 1.);
  // point Light
  for(int i=0;i<3;i++){
    vec4 res = vec4(surfaceColor, 1.);
    float rad = float(i)*2.*PI/3.;
    vec3 pointPos = vec3(cos(rad+t), -.1, sin(rad+t));
    pointPos.xz *= .8;
    lightPos = pointPos;
    vec3 pointVec = pointPos - (modelMat*vec4(pos, 0.)).xyz;
    vec3  invLight  = normalize(modelInvMat * vec4(pointVec, 0.0)).xyz;
    vec3  invEye    = normalize(modelInvMat * vec4(viewEye, 0.0)).xyz;
    vec3  halfLE    = normalize(invLight + invEye);
    float ambient   = 0.05;
    float diffuse   = clamp(dot(v_normal, invLight), 0.1, 1.0) + 0.0;
    float specular  = pow(clamp(dot(v_normal, halfLE), 0.0, 1.0), 100.*mouse.x);
    float attenuation = 1./ (1. + 20.*pow(length(pointPos-(modelMat*vec4(pos, 0.)).xyz), 2.));
    res *= vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambient;
    res *= attenuation;
    v_color += res;
  }

}
