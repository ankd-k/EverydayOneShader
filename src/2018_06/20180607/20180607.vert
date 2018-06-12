/*{
    "vertexCount": 500.,
    "vertexMode": "LINES",

    "PASSES": [
      {
        "fs": "camera.frag",
        "TARGET": "cameraTexture",
        "FLOAT": true,
      },
      {},
    ],
}*/
precision mediump float;
const float PI = 3.14159265359;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D cameraTexture;
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

varying vec4 v_color;


float ease_in(in float x, in float n){
  return pow(x, n);
}
float ease_out(in float x, in float n){
  return 1.-pow(1.-x, n);
}
float ease_inout(in float x, in float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*ease_in(x2, n) :
                 0.5*ease_out(x2-1., n)+0.5;
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43213.9879);
}
vec3 random3(vec2 n){
  return vec3(
      random(n+vec2(0.,0.)),
      random(n+vec2(0.,100.)),
      random(n+vec2(0.,10000.))
    );
}


void main(){
    float t = mod(time*0.5, 60.);
    vec3 pos = vec3(0.);

    float lineNum = floor(vertexId / 2.);
    float lineId = mod(vertexId, 2.);

    float tl = floor(t+lineNum*0.05);
    float tf = fract(t+lineNum*0.05);

    vec3 p1 = random3(vec2(lineNum, tl))*2.-1.;
    vec3 p2 = random3(vec2(lineNum, tl+1.))*2.-1.;

    float ease = mod(lineId, 2.)<1. ? ease_out(clamp(tf*2., 0., 1.), 3.) :
                                      ease_in(clamp(tf*2.-1., 0., 1.), 1.5);
    pos = ease * p2 + (1.-ease) * p1;
    pos *= 10.;

    gl_Position = getCameraMatrix() * vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(vec3(random(vec2(lineNum,0.))), 1.);
}
