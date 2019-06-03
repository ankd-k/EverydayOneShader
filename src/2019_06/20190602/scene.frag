/*{
  pixelRatio: 1.0,
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

#define MARCHING_NUM 100

float usin(in float x) {
  return 0.5 + 0.5*sin(x);
}
vec2 rotate(in vec2 p, in float r) {
  float c=cos(r), s=sin(r);
  return mat2(c, -s, s, c) * p;
}
float hash(in vec2 x) {
  return fract(sin(dot(x, vec2(12.9898, 78.233))) * 43273.5324);
}
vec3 hash3(in vec2 x) {
  return vec3(
      hash(x + vec2(4.92, 8.73)),
      hash(x + vec2(9.16, 1.65)),
      hash(x + vec2(7.51, 3.42))
    );
}
float noise(in vec2 x) {
  vec2 f = fract(x);
  vec2 i = floor(x);
  vec2 u = f*f*(3.0-2.0*f);

  return -1.0+2.0*
    mix(mix(hash(i+vec2(0., 0.)), hash(i+vec2(1.,0.)), u.x),
        mix(hash(i+vec2(0., 1.)), hash(i+vec2(1.,1.)), u.x),
        u.y);
}

float sdSphere(in vec3 p, in float r) {
  return length(p) - r;
}
float sdBox(in vec3 p, in vec3 b) {
  vec3 d = abs(p) - b;
  return length(max(d, 0.))
    + min(max(d.x, max(d.y, d.z)), 0.);
}
float sdPlane(in vec3 p, in vec3 n, in float h) {
  return dot(p, n) - h;
}

float disp(in vec3 p) {
  return noise(p.xy+p.yz+p.zx);// + noise(p.yz) + noise(p.zx);
  // return sin(p.x*10.0) * sin(p.y*12.0) * sin(p.z*1.0);
}

vec2 opU(in vec2 d1, in vec2 d2) {
  return d1.x<d2.x ? d1 : d2;
}
vec2 opSU(in vec2 d1, in vec2 d2, in float k) {
  float h = clamp(0.5 + 0.5*(d2.x-d1.x)/k, 0., 1.);
  return mix(d2, d1, h) - k*h*(1.0-h);
}

vec3 opRep(in vec3 p, in vec3 c) {
  return mod(p, c) - 0.5*c;
}

vec2 map(in vec3 p) {
  vec3 q = p;
  vec2 res = vec2(sdSphere(q, 1.5+0.4*sin(time)), 1.0);
  res.x += 0.1 * disp(p*3.0+time);

  q = p;
  q.y -= time;
  q = opRep(q, vec3(5.0));
  for(int i=0;i<5;i++) {
    float fi = float(i+1);
    q = abs(q);
    q -= vec3(0.3 + 0.2*usin(time*0.2),
              0.4 + 0.3*usin(time*0.12),
              0.5 + 0.2*usin(time*0.17));
    q.xy = rotate(q.xy, fi+time*0.01);
    q.yz = rotate(q.yz, fi+time*0.02);
    q.zx = rotate(q.zx, fi+time*0.03);
  }
  res = opSU(res, vec2(sdBox(q, vec3(1.0, 0.02, 0.05)), 1.0), 0.3);

  return res;
}


vec2 rayMarch(in vec3 ro, in vec3 rd) {
  float mn=0.1, mx=100.0, thr=1e-4;
  float d=mn, m=-1.0;
  for(int i=0;i<MARCHING_NUM;i++) {
    vec3 pos = ro + rd*d;
    vec2 tmp = map(pos);
    if(tmp.x<thr || mx<tmp.x) break;
    d += tmp.x*0.7;
    m = tmp.y;
  }
  if(mx<d) m = -1.0;
  return vec2(d, m);
}

vec3 getNormal(in vec3 p) {
  vec2 e = vec2(1., -1.) * 0.01;
  return normalize(
      e.xyy * map(p + e.xyy).x +
      e.yxy * map(p + e.yxy).x +
      e.yyx * map(p + e.yyx).x +
      e.xxx * map(p + e.xxx).x
    );
}

vec3 render(in vec3 ro, in vec3 rd) {
  vec2 res = rayMarch(ro, rd);
  float d=res.x, m=res.y;

  vec3 pos = ro + rd*d;
  vec3 nor = getNormal(pos);

  vec3 lp = 5.*vec3(cos(time), 1., sin(time));
  vec3 ld = normalize(lp - pos);

  vec3 color = vec3(0.0);
  if(0.<m) {
    color += pow(dot(ld, nor)*0.7+0.3, 10.0);
  }

  color *= exp(-0.4*d);
  return color;
}

void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  float t = time*0.08;
  float seed = hash(vec2(floor(t)));

  // ray origin
  vec3 ros = 5.0*hash3(vec2(seed));
  vec3 rog = 5.0*hash3(vec2(seed+1.0));
  vec3 ro = mix(ros, rog, fract(t));
  // ray direction
  vec3 tar = vec3(-0.5+hash3(vec2(seed+100.0)));
  vec3 cz = normalize(tar-ro);
  vec3 cx = normalize(cross(vec3(0.,1.,0.), cz));
  vec3 cy = normalize(cross(cz, cx));
  vec3 rd = mat3(cx, cy, cz) * normalize(vec3(p, 1.0));

  // rendering
  vec3 color = render(ro, rd);

  // post process
  color = pow(color, vec3(0.4545));
  // color = vec3(1.0);
  color *= exp(-0.9*length(p));

  gl_FragColor = vec4(color, 1.);
}
