/*{
  pixelRatio: 1.0,
  frameskip: 1.0,
}*/
precision highp float;

// basic
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform int FRAMEINDEX;
// audio
uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;
// midi
uniform sampler2D midi;
uniform sampler2D note;

const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;

vec2 rotate(in vec2 p, in float r) {
  float c=cos(r), s=sin(r);
  return mat2(c, -s, s, c) * p;
}

float sdSphere(in vec3 p, in float r) {
  return length(p) - r;
}
float sdBox(in vec3 p, in vec3 b) {
  vec3 d = abs(p) - b;
  return length(max(d, 0.))
   + min(max(d.x, max(d.y, d.z)), 0.);
}
float sdWireBox(in vec3 p, in vec3 b, in float w) {
  float base = sdBox(p, b);
  float hole = min(sdBox(p, b-vec3(w, w, -0.1)), min(sdBox(p, b-vec3(w, -0.1, w)), sdBox(p, b-vec3(-0.1, w, w))));
  return max(-hole, base);
}

float map(in vec3 p) {
  float res=1000000.0;
  vec3 q = p;

  for(int i=0;i<5;i++) {
    float fi = float(i+1);
    q.xy = rotate(q.xy, time*0.1*fi);
    q.yz = rotate(q.yz, time*0.1*fi);
    float r = 0.2*fi;
    res = min(res, sdWireBox(q, vec3(r), r*0.1));
  }
  return res;
}

void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // ray
  vec3 ro = vec3(cos(time), 0., sin(time));
  vec3 tar = vec3(0.);
  vec3 cz = normalize(tar - ro);
  vec3 cx = normalize(cross(vec3(0., 1., 0.), cz));
  vec3 cy = normalize(cross(cz, cx));
  vec3 rd = mat3(cx, cy, cz) * normalize(vec3(p, 1.0));

  // march
  float d = 0.0;
  for(int i=0;i<18;i++) {
    vec3 pos = ro + rd*d;
    float tmp = map(pos);
    if(tmp<1e-4)break;
    d += tmp;
  }

  // rendering
  vec3 pos = ro + rd*d;
  color = vec3(exp(-1.*d));

  gl_FragColor = vec4(color, 1.);
}
