/*{
pixelRatio: 1.,
"PASSES":[
  {
    fs: 'back.frag',
    TARGET: 'backTexture',
    FLOAT: true,
  },
  {

  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D backTexture;

const float PI = 3.14159265359;

float easeIn(float x, float n){
  return pow(x, n);
}
float easeOut(float x, float n){
  return 1.-pow(1.-x, n);
}
float easeInout(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easeIn(x2, n) : 0.5+0.5*easeOut(x2-1., n);
}
float easeOutin(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easeOut(x2, n) : 0.5+0.5*easeIn(x2-1., n);
}

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}
mat3 rotate(vec3 r){
  vec3 s = sin(r);
  vec3 c = cos(r);

  mat3 rx = mat3(
    1., 0., 0.,
    0., c.x, -s.x,
    0., s.x, c.x
  );
  mat3 ry = mat3(
    c.y, 0., s.y,
    0., 1., 0.,
    -s.y, 0., c.y
  );
  mat3 rz = mat3(
    c.z, -s.z, 0.,
    s.z, c.z, 0.,
    0., 0., 1.
  );

  return rz*rx*ry;
}

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43213.7894);
}
vec3 random3(vec2 n){
  return vec3(
      random(n + vec2(100., 0.)),
      random(n + vec2(10., 10.)),
      random(n + vec2(0., 100.))
    );
}

vec3 opRep(vec3 p, vec3 c){
  return mod(p-0.5*c, c)-0.5*c;
}

float dfBox(vec3 p, vec3 offset, vec3 b){
  vec3 d = abs(p-offset)-b;
  return min(max(d.x, max(d.y, d.z)), 0.) + length(max(d, 0.));
}

float df(vec3 p){
  p = opRep(p, vec3(1.));
  p *= rotate(vec3(time, time, time));
  float box = dfBox(p, vec3(0.), vec3(0.2));
  return box;
}

bool castRay(inout vec3 ro, inout vec3 rd, out vec3 ip){
  float d = 0.;
  for(int i=0;i<64;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.005){
      ip = ro + rd*d;
      rd = rd*d;
      return true;
    }
    if(20.<d) return false;
    d += tmp;
  }
  return false;
}

vec3 getNormal(vec3 p){
  float d = 0.001;
  return normalize(vec3(
      df(p + vec3(  d, 0.0, 0.0)) - df(p + vec3( -d, 0.0, 0.0)),
      df(p + vec3(0.0,   d, 0.0)) - df(p + vec3(0.0,  -d, 0.0)),
      df(p + vec3(0.0, 0.0,   d)) - df(p + vec3(0.0, 0.0,  -d))
  ));
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
  float t = mod(time*0.3, 60.);
  float tl = floor(t);
  float tf = fract(t);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float pct = tf;//easeOutin(tf, 2.);

  vec3 ps = vec3(
      random(vec2(tl, 0.)),
      random(vec2(tl, 1.)),
      random(vec2(tl, 2.))
    )*2.-1.;
  ps *= 4.;
  vec3 pg = vec3(
      random(vec2(tl, 3.)),
      random(vec2(tl, 4.)),
      random(vec2(tl, 5.))
    )*2.-1.;
  vec3 target = vec3(
      random(vec2(tl, 6.)),
      random(vec2(tl, 7.)),
      random(vec2(tl, 8.))
    )*2.-1.;
  // target = target*2.-1.;
  target *= 10.;

  vec3 pn = (1.-pct)*ps + pct*pg;

  // r = vec3(time*0.2, time*0.3, time*0.1);
  mat3 rm = calcLookAtMatrix(pn, target, 0.);

  float ls = random(vec2(tl, 100.));
  float lg = random(vec2(tl+1., 100.));
  float l = (1.-pct)*ls + pct*lg;

  vec3 camPos = rm * vec3(0., 0., -2.);
  vec3 dir = rm*normalize(vec3(p, 1.));

  vec3 ip;
  if(castRay(camPos, dir, ip)){
    color = vec3(0.03*length(dir)) + df(ip-1.);
    color = pow(clamp(color, 0., 1.), vec3(1.));
    color += 1.;
    color = color*clamp(texture2D(backTexture, (1.-uv)+dot(normalize(dir), getNormal(ip))*0.15).rgb, 0., 1.5);
    // color = abs(usin(time)-clamp(color, 0., 1.));
    // color = pow(color, vec3(.5));
  }else {
    // color = texture2D(backTexture, uv).rgb*0.2;
    color = vec3(0.);
  }

  color *= 0.9/length(p);
  gl_FragColor = vec4(color, 1.);
}
