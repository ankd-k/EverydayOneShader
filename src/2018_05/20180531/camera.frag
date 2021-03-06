precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

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


// extend function
float usin(float x){
  return 0.5+0.5*sin(x);
}

float ucos(float x){
  return 0.5+0.5*cos(x);
}


vec3 Lissajous(float theta, vec3 amp, vec3 freq, vec3 pha){
    vec3 p;
    p.x = amp.x * sin(freq.x*theta + pha.x);
    p.y = amp.y * sin(freq.y*theta + pha.y);
    p.z = amp.z * sin(freq.z*theta + pha.z);
    return p;
}

// rotate
mat3 rotateAxis(float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    return mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
}




void main(){
    float t = mod(time*0.2, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;


    // float A = 1.;
    // float B = 1.;
    // float C = 1.;
    // vec3 amp = vec3(A, B, C);
    // float alpha = 3.;
    // float beta = 2.;
    // float gamma = 4.;
    // vec3 freq = vec3(alpha, beta, gamma);
    // float a = 3.8;//*usin(t*.3);
    // float b = 4.2;//*usin(t*.4);
    // float c = 7.7;//*usin(t*.5);
    // vec3 pha = vec3(a, b, c);
    //
    // float theta = t*0.8;
    //
    // vec3 eye = Lissajous(theta, amp, freq, pha);
    // float thetaNext = theta + 0.1;
    // vec3 eyeNext = Lissajous(thetaNext, amp, freq, pha);
    // vec3 dir = normalize(eyeNext - eye);


    // model matrix
    vec3 m_pos = vec3(0.);
    vec3 m_angle = vec3(0.,time,0.);
    vec3 m_scale = vec3(1.);
    mat4 mMat = mMatrix(m_pos, m_angle, m_scale);
    // view matrix
    vec3 v_eye = vec3(0., 0.0, 2.);
    vec3 v_target = vec3(0.);
    vec3 v_up = vec3(0.,1.,0.);
    mat4 vMat = vMatrix(v_eye, v_target, v_up);

    // projection matrix
    float p_fov = PI/6.;
    float p_aspect = resolution.x/resolution.y;
    float p_near = 0.01;
    float p_far = 10.0;
    mat4 pMat = pMatrix(p_fov, p_aspect, p_near, p_far);

    mat4 mvp = mvpMatrix(
        m_pos, m_angle, m_scale,
        v_eye, v_target, v_up,
        p_fov, p_aspect, p_near, p_far
      );

    if(uv.y<0.25){
        if(uv.x<0.25) gl_FragColor = vec4(mvp[0][0], mvp[0][1], mvp[0][2], mvp[0][3]);
        else if(uv.x<0.5) gl_FragColor = vec4(mvp[1][0], mvp[1][1], mvp[1][2], mvp[1][3]);
        else if(uv.x<0.75) gl_FragColor = vec4(mvp[2][0], mvp[2][1], mvp[2][2], mvp[2][3]);
        else gl_FragColor = vec4(mvp[3][0], mvp[3][1], mvp[3][2], mvp[3][3]);
    }
    else if(uv.y<0.5){
        if(uv.x<0.25) gl_FragColor = vec4(mMat[0][0], mMat[0][1], mMat[0][2], mMat[0][3]);
        else if(uv.x<0.5) gl_FragColor = vec4(mMat[1][0], mMat[1][1], mMat[1][2], mMat[1][3]);
        else if(uv.x<0.75) gl_FragColor = vec4(mMat[2][0], mMat[2][1], mMat[2][2], mMat[2][3]);
        else gl_FragColor = vec4(mMat[3][0], mMat[3][1], mMat[3][2], mMat[3][3]);
    }
    else if(uv.y<0.75){
        if(uv.x<0.25) gl_FragColor = vec4(vMat[0][0], vMat[0][1], vMat[0][2], vMat[0][3]);
        else if(uv.x<0.5) gl_FragColor = vec4(vMat[1][0], vMat[1][1], vMat[1][2], vMat[1][3]);
        else if(uv.x<0.75) gl_FragColor = vec4(vMat[2][0], vMat[2][1], vMat[2][2], vMat[2][3]);
        else gl_FragColor = vec4(vMat[3][0], vMat[3][1], vMat[3][2], vMat[3][3]);
    }
    else{
        if(uv.x<0.25) gl_FragColor = vec4(pMat[0][0], pMat[0][1], pMat[0][2], pMat[0][3]);
        else if(uv.x<0.5) gl_FragColor = vec4(pMat[1][0], pMat[1][1], pMat[1][2], pMat[1][3]);
        else if(uv.x<0.75) gl_FragColor = vec4(pMat[2][0], pMat[2][1], pMat[2][2], pMat[2][3]);
        else gl_FragColor = vec4(pMat[3][0], pMat[3][1], pMat[3][2], pMat[3][3]);
    }
}
