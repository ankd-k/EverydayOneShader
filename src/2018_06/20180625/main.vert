/*{
    "vertexCount": 360.,
    "vertexMode": "LINES",

    "PASSES":[
      {
        fs: "camera.frag",
        TARGET: "cameraTexture",
        FLOAT: true,
      },
      {

      },
    ],
}*/
precision mediump float;

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

const float PI = 3.14159265359;

float easein(float x, float n){
  return pow(x, n);
}
float easeout(float x, float n){
  return 1.-pow(1.-x, n);
}
float easeinout(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easein(x2, n) :
                 0.5*easeout(x2-1., n) + 0.5;
}

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}

void main(){
  float t = mod(time*0.8, 60.);

  vec3 pos = vec3(0.);

  float triNum = floor(vertexId/6.);
  float r = (triNum+1.) * 0.12;

  float triId = mod(vertexId, 6.);
  float triBase = floor(triId/2.);

  vec2 index = triBase<1. ? vec2(0., 1.) :
               triBase<2. ? vec2(1., 2.) : vec2(2., 0.);


  vec3 p = vec3(0., r, 0.);
  vec3 p1 = p; p1.xy *= rotate(index.x * 2.*PI/3.);
  vec3 p2 = p; p2.xy *= rotate(index.y * 2.*PI/3.);

  float n = 0.04;
  float tl = floor(t+triNum*n);
  float tf = fract(t+triNum*n);
  float es = 3.;
  float e = mod(triId, 2.)<1. ? easeout(tf, es) : easein(tf, es);
  pos = (1.-e)*p2 + e*p1;

// pos.z = sin(triNum*0.1+t*2.)*0.3;

  // pos = vec3(0.);

  gl_Position = getCameraMatrix() * vec4(pos, 1.);
  gl_PointSize = 1.;
  v_color = vec4(1.);
}
