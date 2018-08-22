/*{
    "vertexCount": 30.,
    "vertexMode": "TRIANGLES",
    "PASSES":[
      {
        fs: 'camera.frag',
        TARGET: 'cameraTexture',
        FLOAT: true,
      },
      {
        BLEND: 'ADD',
      },
    ],
}*/
precision highp float;

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
varying vec3 v_position;
varying vec2 v_uv;
varying float v_panel;

const float PI = 3.14159265359;

float ease_in(float x, float n){
  return pow(x, n);
}

float ease_out(float x, float n){
  return 1.0-pow(1.0-x, n);
}

float ease_inout(float x, float n){
  float x2 = x*2.0;
  return x2<1. ?
    ease_in(x2, n)*0.5 :
    ease_out(x2-1., n)*0.5+0.5;
}

float ease_outin(float x, float n){
  float x2 = x*2.0;
  return x2<1. ?
    ease_out(x2, n)*0.5 :
    ease_in(x2-1., n)*0.5+0.5;
}

void main(){
  float t = mod(time, 600.);
  float ft = fract(t);
  float it = floor(t);
  vec3 pos = vec3(0.);

  float panelId = floor(vertexId/6.0);
  pos.z = panelId - 2.0;
  pos.z = -2.0 + panelId*ease_out(ft, 4.);
  v_panel = panelId;

  float vId = mod(vertexId, 6.0);

  vec4 index;
  if(mod(vertexId, 12.)<6.) index = vec4(0., 1., 2., 3.);
  else index = vec4(3., 2., 1., 0.);
  index = vec4(0., 1., 2., 3.);

  float vi =
    vId<1. ? index.x :
    vId<2. ? index.y :
    vId<3. ? index.z :
    vId<4. ? index.z :
    vId<5. ? index.w :
             index.x ;

  pos.xy =
    vi<1. ? vec2(-1., -1.) :
    vi<2. ? vec2(1., -1.) :
    vi<3. ? vec2(1., 1.) :
            vec2(-1., 1.) ;
  v_uv =
    vi<1. ? vec2(0., 0.) :
    vi<2. ? vec2(1., 0.) :
    vi<3. ? vec2(1., 1.) :
            vec2(0., 1.) ;

  pos.xy *= 0.75;

  gl_Position = getCameraMatrix() * vec4(pos, 1.);
  v_position = pos;
  // v_uv = gl_Position.xy;
  // v_uv = pos.xy;
  gl_PointSize = 1.;
  v_color = vec4(1.);
}
