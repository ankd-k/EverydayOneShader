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

highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
float random(float n){
  return random(vec2(n));
}
vec3 random3(float n){
  return vec3(
      random(n + 0.0),
      random(n + 10.0),
      random(n + 100.0)
    );
}

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


void plane(in float id, in vec3 offset, in vec2 size, out vec3 pos, out vec2 uv){
  id = mod(id, 6.);

  vec4 index = vec4(0., 1., 2., 3.);

  float vi =
    id<1. ? index.x :
    id<2. ? index.y :
    id<3. ? index.z :
    id<4. ? index.z :
    id<5. ? index.w :
            index.x ;

  pos = vec3(0.);

  pos.xy +=
    vi<1. ? vec2(-1., -1.) :
    vi<2. ? vec2(1., -1.) :
    vi<3. ? vec2(1., 1.) :
            vec2(-1., 1.) ;
  uv =
    vi<1. ? vec2(0., 0.) :
    vi<2. ? vec2(1., 0.) :
    vi<3. ? vec2(1., 1.) :
            vec2(0., 1.) ;

  pos.xy *= size;
  pos += offset;

}


void main(){
  float t = mod(time, 600.);
  float ft = fract(t);
  float it = floor(t);

  float vId = mod(vertexId, 6.0);
  float panelId = floor(vertexId/6.0);
  v_panel = panelId;

  vec3 os = vec3(
      random(vec2(panelId, it + 0.)),
      random(vec2(panelId, it + 50.)),
      random(vec2(panelId, it + 100.))
    );
  os = os*2.-1.;
  vec3 og = vec3(
      random(vec2(panelId, it + 1.)),
      random(vec2(panelId, it + 51.)),
      random(vec2(panelId, it + 101.))
    );
  og = og*2.-1.;
  float pct = ease_out(ft, 4.);
  vec3 offset = (1.-pct)*os + pct*og;

  vec3 pos = vec3(0.);
  plane(vId, offset, vec2(1), pos, v_uv);

  gl_Position = getCameraMatrix() * vec4(pos, 1.);
  v_position = pos;
  // v_uv = gl_Position.xy;
  // v_uv = pos.xy;
  gl_PointSize = 1.;
  v_color = vec4(1.);
}
