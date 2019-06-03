/*{
  pixelRatio: 1.0,
  frameskip: 2.0,
}*/

// I'll make seascape from https://www.shadertoy.com/view/Ms2SD1

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

// noise
float hash(in vec2 x) {
  float h = dot(x, vec2(127.1, 311.7));
  return fract(sin(h)*43273.5323);
}
float noise(in vec2 p) {// value noise
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0 - 2.0*f);
  return -1.0 + 2.0*
    mix(
      mix(
        hash(i + vec2(0., 0.)),
        hash(i + vec2(1., 0.)), u.x
      ),
      mix(
        hash(i + vec2(0., 1.)),
        hash(i + vec2(1., 1.)), u.x
      ),
      u.y
    );
}
// rotate
vec2 rotate(in vec2 p, in float r) {
  float c = cos(r), s = sin(r);
  return mat2(c, -s, s, c) * p;
}


// lighting
float diffuse(in vec3 n, in vec3 l, in float p) {
  return pow(dot(n, l)*0.4+0.6, p);
}
float specular(in vec3 n, in vec3 l, in vec3 e, in float s) {
  float nrm = (s + 8.0) / (PI * 8.0);
  return pow(max(dot(reflect(e,n), l), 0.0), s) * nrm;
}

// sky
vec3 getSkyColor(in vec3 e) {
  e.y = max(e.y, 0.);
  return vec3(pow(1.0-e.y, 2.0), 1.0-e.y, 0.6 + (1.0-e.y)*0.4);
}

// sea
const float SEA_FREQ = 0.12;
const float SEA_HEIGHT = 0.8;
const float SEA_CHOPPY = 3.0;
const float SEA_SPEED = 0.4;
#define SEA_TIME (1.0 + time*SEA_SPEED)
const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);
const vec3 SEA_BASE = vec3(0.1, 0.19, 0.28);
const vec3 SEA_WATER_COLOR = vec3(0.8, 0.9, 0.8);

float sea_octave(in vec2 uv, in float choppy) {
  uv += noise(uv);
  vec2 wv = 1.0-abs(cos(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);

  return pow(1.0-pow(wv.x*wv.y, 0.65), choppy);
}

float map(in vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz;
  uv.x *= 0.75;

  float d, h=0.0;
  for(int i=0;i<4;i++) {
    d = sea_octave((uv+SEA_TIME) * freq, choppy);
    d += sea_octave((uv-SEA_TIME) * freq, choppy);
    h += d*amp;
    uv *= octave_m; freq *= 1.9; amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}
// is map_detailed() same with map()?
//   map() and map_detailed() is different at loop time.
float map_detailed(in vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz;
  uv.x *= 0.75;

  float d,h = 0.0;
  for(int i=0;i<6;i++){
    d = sea_octave((uv+SEA_TIME)*freq, choppy);
    d += sea_octave((uv-SEA_TIME)*freq, choppy);
    h += d * amp;
    uv *= octave_m; freq *= 1.9; amp *= 0.22;
    choppy = mix(choppy, 1., 0.2);
  }
  return p.y - h;
}

vec3 getSeaColor(
  in vec3 p,
  in vec3 nor,
  in vec3 ld,
  in vec3 eye,
  in vec3 dist
) {
  float fresnel = clamp(1.0 - dot(nor, -eye), 0.0, 1.0);
  fresnel = pow(fresnel, 3.0) * 0.65;

  vec3 reflected = getSkyColor(reflect(eye, nor));
  vec3 refracted = SEA_BASE + diffuse(nor, ld, 80.0) * SEA_WATER_COLOR * 0.12;

  vec3 color = mix(refracted, reflected, fresnel);

  float atten = max(1.0 - dot(dist, dist) * 0.001, 0.);
  color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT)*0.18 * atten;

  color += vec3(specular(nor, ld, eye, 60.0));

  return color;
}

vec3 calcNormal(vec3 p, float e) {
  vec3 n;
  n.y = map_detailed(p);
  n.x = map_detailed(vec3(p.x+e, p.y, p.z)) - n.y;
  n.z = map_detailed(vec3(p.x, p.y, p.z+e)) - n.y;
  n.y = e;
  return normalize(n);
}

float heightMapTracing(in vec3 ro, in vec3 rd, out vec3 p) {
  float tm=0.0, tx=1000.0;
  float hx = map(ro + rd*tx);
  if(hx > 0.0) return tx;
  float hm = map(ro + rd*tm);

  float tmid = 0.0;
  for(int i=0;i<8;i++) {
    tmid = mix(tm, tx, hm/(hm-hx));
    p = ro + rd*tmid;
    float hmid = map(p);
    if(hmid<0.0) {
      tx = tmid;
      hx = hmid;
    } else {
      tm = tmid;
      hm = hmid;
    }
  }
  return tmid;
}

void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);

  // define ray
  vec3 ro = vec3(0., 3.5, -time*2.0);
  vec3 rd = normalize(vec3(p, 2.0));
  rd.yz = rotate(rd.yz, -0.4+0.2*noise(vec2(time*0.1)));
  rd.xy = rotate(rd.xy, 0.1*noise(vec2(time*0.1)));
  rd.zx = rotate(rd.zx, time*0.1);

  // ray trace
  vec3 pos;
  heightMapTracing(ro, rd, pos);
  vec3 dist = pos - ro;
  vec3 nor = calcNormal(pos, dot(dist, dist)*0.00051);
  vec3 ld = normalize(vec3(0., 1., 0.2));

  // rendering
  vec3 color = mix(
      getSkyColor(rd),
      getSeaColor(pos, nor, ld, rd, dist),
      pow(smoothstep(0., -0.05, rd.y), 0.3)
    );

  // post
  gl_FragColor = vec4(pow(color, vec3(0.75)), 1.);

  // gl_FragColor *= clamp((1.0-0.2*float(FRAMEINDEX)/60.0), 0., 1.);
}
