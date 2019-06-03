/*{
  pixelRatio: 1.0,
  "PASSES":[
    {
      TARGET: 'sceneTex',
    },
    {

    },
  ],
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

// passes
uniform int PASSINDEX;
uniform sampler2D sceneTex;


const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;

mat2 rotate(in float r){
  float c=cos(r), s=sin(r);
  return mat2(c, -s, s, c);
}
float random(in vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 78.233)))*43273.5323);
}
float random(in float n){
  return random(vec2(n));
}
float noise(in float x){
  float f = fract(x);
  float i = floor(x);

  float u = f*f*(3.0-2.0*f);

  return mix(random(i), random(i+1.0), u);
}
float noise(in vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f*f*(3.0-2.0*f);

  return mix(a, b, u.x) +
          (c-a)*(1.0-u.x)*u.y+
          (d-b)*u.x*u.y;
}


float sdSphere(in vec3 p, in float r){
  return length(p) - r;
}
float sdBox(in vec3 p, in vec3 b){
  vec3 d = abs(p)-b;
  return length(max(d, 0.)) + max(max(d.x, max(d.y, d.z)), 0.);
}
float sdCylinder(in vec3 p, in float r){
  return length(p.xz) - r;
}

vec2 opU(in vec2 d1, in vec2 d2){
  return d1.x<d2.x ? d1 : d2;
}
vec2 opSmoothUnion(in vec2 d1, in vec2 d2, in float k) {
  float h = clamp(0.5+0.5*(d2.x-d1.x)/k, 0., 1.);
  return vec2(mix(d2.x, d1.x, h) - k*h*(1.0-h), mix(d2.y, d1.y, h));
}

vec3 opRep(in vec3 p, in vec3 c){
  return mod(p, c) - 0.5*c;
}

float b(in vec3 p){
  float b = sin(.2*p.x)*sin(.4*p.y)*sin(.3*p.z);
  return 0.1*b*b*b;
}

#define GRID_W 7.5
#define GRID_K 2.0
#define GRID_R 0.11
vec2 grid(in vec3 p){
  vec2 res;
  vec3 gridm = vec3(1.0);

  vec3 q = p;
  q.zx *= rotate(0.5*PI);
  q.xz = opRep(q, vec3(GRID_W)).xz;
  res = vec2(sdCylinder(q, GRID_R+0.1*noise(q.y*1.0)), gridm.x);

  q = p;
  q.xy *= rotate(0.5*PI+0.05*q.z);
  q.xz = opRep(q, vec3(GRID_W)).xz;
  res = opSmoothUnion(res, vec2(sdCylinder(q, GRID_R+0.1*noise(q.y)), gridm.y), GRID_K);

  q = p;
  q.yz *= rotate(0.5*PI);
  q.xz = opRep(q, vec3(GRID_W)).xz;
  res = opSmoothUnion(res, vec2(sdCylinder(q, GRID_R+0.1*noise(q.y*2.0)), gridm.z), GRID_K);

  return res;
}

vec2 map(in vec3 p){
  vec2 res;
  vec3 q = p;
  // q.z += noise(q.z);
  q.x += 5.0*noise(q.z*0.2);
  q.y += 5.0*noise(q.z*0.19);
  q.xy *= rotate(2.0*PI*noise(q.z*0.01));

  res = grid(q)+b(q);

  return res;
}

vec2 castRay(in vec3 ro, in vec3 rd){
  float minD=0., maxD=35.0;
  float d=minD, m=-1.0;
  for(int i=0;i<64;i++){
    vec2 tmp = map(ro+rd*d);
    if(tmp.x<0.00001 || maxD<tmp.x) break;
    d += tmp.x*0.5;
    m = tmp.y;
  }
  if(maxD<d) m=-1.0;

  return vec2(d, m);
}

vec3 calcNormal(in vec3 p){
  vec2 e = vec2(1.0, -1.0) * 0.0001;
  return normalize(
      e.xyy*map(e.xyy+p).x +
      e.yxy*map(e.yxy+p).x +
      e.yyx*map(e.yyx+p).x +
      e.xxx*map(e.xxx+p).x
    );
}


vec3 render(in vec3 ro, in vec3 rd){
  vec2 res = castRay(ro, rd);
  float d = res.x;
  float m = res.y;

  vec3 pos = ro+rd*d;
  vec3 nor = calcNormal(pos);

  vec3 lp = ro;
  vec3 ld = normalize(lp-pos);

  vec3 color;
  color = vec3(1.0);
  // color = vec3(dot(ld, nor));

  color *= exp(-0.1*d);

  color *= m;

  color = pow(color, vec3(0.4545));
  // if(res.y<0.) color = vec3(0.);
  return color;
}

mat3 lookAt(in vec3 eye, in vec3 tar, in float r){
  vec3 cw = normalize(tar - eye);
  vec3 cp = vec3(sin(r), cos(r), 0.);
  vec3 cu = normalize(cross(cp, cw));
  vec3 cv = normalize(cross(cw, cu));
  return mat3(cu, cv, cw);
}

vec3 highContrast(in vec3 col){
  float e = 2.718281828459045235360287471352;
  vec3 k =   vec3(0.8,0.8,0.8);
  vec3 min = vec3(0.0,0.0,0.0);
  vec3 max = vec3(1.0,1.0,1.0);

  col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);
  col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);
  col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);
  return col;
}

#define AA 1
void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec4 color = vec4(0.);

  if(PASSINDEX==0){
    vec3 ro = vec3(3.0*sin(time*0.17), 4.0*sin(time*0.23), 2.*sin(time*0.31))-vec3(0., 0., 5.0*time);
    ro = vec3(0., 0., -1.0*time);
    vec3 tar = ro - vec3(1., -1., 2.);
    vec3 rd = normalize(lookAt(ro, tar, 0.)*vec3(p, 1.0));

    color = vec4(render(ro, rd), 1.0);
    gl_FragColor = color;
  }else{
    vec2 step = 1.0/resolution;

    for(int i=0;i<AA;i++){
      for(int j=0;j<AA;j++){
        color += texture2D(sceneTex, uv+step*vec2(float(i), float(j)));
      }
    }
    color /= float(AA*AA);
    // color = pow(color*1.5, vec4(4.0));
    // color *= exp(-1.0*length(p));
    gl_FragColor = color;
  }
}
