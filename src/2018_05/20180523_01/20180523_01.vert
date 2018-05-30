/*{
    "vertexCount": 36000.,
    "vertexMode": "LINE_STRIP",


    "PASSES": [
      {
        "fs": "./camera.frag",
        "TARGET": "cameraTexture",
        "FLOAT": true,
      },
      {

      }
    ]
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D cameraTexture;

varying vec4 v_color;

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


const float PI = 3.14159265359;

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
    float t = mod(time, 600.);

    float A = 1.;
    float B = 1.;
    float C = 1.;
    vec3 amp = vec3(A, B, C);
    float alpha = 3.;
    float beta = 2.;
    float gamma = 4.;
    vec3 freq = vec3(alpha, beta, gamma);
    float a = 3.8;//*usin(t*.3);
    float b = 4.2;//*usin(t*.4);
    float c = 7.7;//*usin(t*.5);
    vec3 pha = vec3(a, b, c);

    float id = floor(vertexId/3.);
    float count = vertexCount/3.;
    float pct = id/count;
    float theta = id/count * 2.*PI;// + t*0.1;

    vec3 pos = Lissajous(theta, amp, freq, pha);
    float thetaNext = (id+1.)/count * 2.*PI;// +t*0.1;
    vec3 posNext = Lissajous(thetaNext, amp, freq, pha);
    vec3 dir = normalize(posNext - pos);

    vec3 v[4];
    vec3 tmp = normalize(vec3(sin(t*1.5), cos(t*1.5),0.));
    // vec3 tmp = normalize(vec3(1.,0.,0.));
    // v[0] = pos + 0.3*rotateAxis(id*0.1+t*5., dir)*cross(dir, tmp);
    // v[0] = pos + 0.2*rotateAxis(id*0.1, dir)*cross(dir, tmp);
    v[0] = pos + 0.2*cross(dir, tmp);
    v[1] = pos + rotateAxis(1.*2.*PI/4., dir)*(v[0] - pos);
    v[2] = pos + rotateAxis(2.*2.*PI/4., dir)*(v[0] - pos);
    v[3] = pos + rotateAxis(3.*2.*PI/4., dir)*(v[0] - pos);

    float num = floor(mod(vertexId,4.));
    // pos = v[0];
    pos = num<1. ? v[0] :
          num<2. ? v[1] :// v[2];
          num<3. ? v[2] : v[3];

    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    // gl_Position = vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(.5);
}
