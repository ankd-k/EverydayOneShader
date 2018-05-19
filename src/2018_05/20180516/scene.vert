/*{
    "vertexCount": 1000.,
    "vertexMode": "POINTS",
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform sampler2D cameraTexture;

varying vec4 v_color;

const float PI = 3.14159265359;

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

mat4 getCameraMatrix(){
    vec4 v0 = texture2D(cameraTexture, vec2(0.));
    vec4 v1 = texture2D(cameraTexture, vec2(0.25,0.));
    vec4 v2 = texture2D(cameraTexture, vec2(0.5,0.));
    vec4 v3 = texture2D(cameraTexture, vec2(0.75,0.));
    return mat4(
        v0.x, v0.y, v0.z, v0.w,
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    );
}

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    vec2 uv = vec2(
            mod(vertexId, resolution.x)/resolution.x,
            floor(vertexId/resolution.x)/resolution.y
        );

    vec4 position = texture2D(positionTexture, uv);
    vec4 velocity = texture2D(velocityTexture, uv);



    // // model matrix
    // vec3 m_pos = vec3(0.);
    // vec3 m_angle = vec3(0.,0.,0.);
    // vec3 m_scale = vec3(1.);
    //
    // // view matrix
    // vec3 v_eye = vec3(0., -0.8, 1.);
    // v_eye = vec3(cos(t*1.5), sin(t*0.2)*0.3, sin(t*2.7))*2.;
    // vec3 v_target = vec3(0.);
    // vec3 v_up = vec3(0.,1.,0.);
    //
    // // projection matrix
    // float p_fov = PI/6.;
    // float p_aspect = resolution.x/resolution.y;
    // float p_near = 0.01;
    // float p_far = 10.0;
    //
    // mat4 mvp = mvpMatrix(
    //     m_pos, m_angle, m_scale,
    //     v_eye, v_target, v_up,
    //     p_fov, p_aspect, p_near, p_far
    //   );

    mat4 mvp = getCameraMatrix();

    gl_Position = mvp*vec4(position.xyz, 1.);
    // gl_Position = vec4(position.xyz, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
