/*{
  pixelRatio: 1.,

  audio: true,
}*/
precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

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
  return random(vec2(n, 0.));
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


mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float dfSphere(vec3 p, float r){
  return length(p)-r;
}

float dfBox(vec3 p, vec3 b){
  return length(max(abs(p)-b, 0.));
  vec3 d = abs(p)-b;
  return min(max(d.x, max(d.y, d.z)), 0.) + length(max(d, 0.));
}

float dfTorus(vec3 p, vec2 t){
  vec2 q = vec2(length(p.xz)-t.x, p.y);
  return length(q)-t.y;
}

float lengthN(vec2 v, float n){
  vec2 tmpV = pow(v, vec2(n));
  return pow(tmpV.x+tmpV.y, 1./n);
}
float dfTorus82(vec3 p, vec2 t){
  vec2 q = vec2(lengthN(p.xz, 2.)-t.x, p.y);
  return lengthN(q, 8.) - t.y;
}
float dfTorus88(vec3 p, vec2 t){
  vec2 q = vec2(lengthN(p.xz, 8.)-t.x, p.y);
  return lengthN(q, 8.) - t.y;
}


vec2 opU(vec2 res1, vec2 res2){
  return res1.x<res2.x ? res1 : res2;
}

vec3 opTx(vec3 p, vec3 t, vec3 r){
  vec3 s = sin(r);
  vec3 c = cos(r);

  mat4 m = mat4(
      c.z*c.x, s.z*c.x, -s.x, 0.,
      c.z*s.x*s.y-s.z*c.y, s.z*s.x*s.y+c.z*c.y, c.x*s.y, 0.,
      c.z*s.x*c.y+s.z*s.y, s.z*s.x*c.y-c.z*s.y, c.x*c.y, 0.,
      t.x, t.y, t.z, 1.
  );

  vec4 q = m * vec4(p, 1.);
  // return p-vec3(0., 1., 0.);
  return q.xyz;
}

vec3 opRep(vec3 p, vec3 c){
  return mod(p, c)-0.5*c;
}



vec2 map(vec3 p){
  float t = mod(time, 600.);
  float ft = fract(t);
  float it = floor(t);

  float pct = 0.;
  p = opRep(p, vec3(1.+ease_in(abs(sin(t*PI*0.25)), 1.5)*3.));
  vec3 pb = p;
  vec3 pt = p;
  for(int i=0;i<2;i++){
    pb = abs(pb);
    pb.xz *= rotate(t*0.2);
    pb.xy *= rotate(t*0.2);
    pb.yz *= rotate(t*0.1);
  }
  // pb *= 1.+0.5*usin(time*3.);

  pct = ease_inout(ft, 3.6);
  // pct = mod(time, 4.)<2. ? pct : 1.-pct;
  vec3 rs = random3(it);
  vec3 rg = random3(it+1.);
  vec3 r = (1.-pct)*rs + pct*rg;
  for(int i=0;i<3;i++){
    pt = abs(pt);
    pt.xz *= rotate(r.y);
    pt.xy *= rotate(r.z);
    pt.yz *= rotate(r.x);
  }

  vec2 res;
  res = vec2(dfBox(pb+vec3(0., 0., 0.), vec3(0.5)), 1.);
  // res = opU(res, vec2(dfTorus88(pt+vec3(0.2), vec2(2., 0.08)), 2.));
  res = opU(res, vec2(dfTorus82(pt+vec3(0.2), vec2(2., 0.08)), 2.));
  return res;
}

vec2 castRay(in vec3 ro, in vec3 rd){
  float minD = 0.;
  float maxD = 40.;
  #if 1
      // bounding volume
      float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) maxD = min( maxD, tp1 );
      float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) minD = max( minD, tp2 );}
  #endif
  float d = minD;
  float m = -1.;
  for(int i=0;i<64;i++){
    float precis = 0.0008*d;
    vec2 res = map(ro + rd*d);
    if(res.x<precis || maxD<d) break;
    d += res.x;
    m = res.y;
  }
  if(maxD<d) m = -1.;
  return vec2(d, m);
}

vec3 calcNormal(vec3 p){
  vec2 h = vec2(0.001, 0.0);
  vec3 n = vec3(
    map(p + h.xyy).x - map(p - h.xyy).x,
    map(p + h.yxy).x - map(p - h.yxy).x,
    map(p + h.yyx).x - map(p - h.yyx).x
  );
  return normalize(n);
}

vec3 calcColor(vec3 ro, vec3 rd, float t){
  vec3 col = vec3(0.);

  vec3 pos = ro + rd*t;
  vec3 nor = calcNormal(pos);
  vec3 ref = normalize(reflect(rd, nor));

  // float occ = ao(pos, nor);
  // float dom = smoothstep(0.0, 0.3, trace(pos + nor*0.001, ref, 0.3));

  // col = nor;
  // col = 0.1*vec3(occ);
  col += clamp(1.0 + dot(rd, nor), 0.0, 1.0)*mix(vec3(1), vec3(1.0, 1.0, 1.0), 1.0);
  // col *= vec3(0.7, 3.0, 5.0);
  return clamp(col+0.5, 0.01, 1.);
}

mat3 lookAt(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

void main(){
  float t = mod(time*0.2, 600.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 eye = vec3(cos(t), 0., sin(t))*10.;
  // vec3 tar = vec3(
  //     random(floor(time*0.5)),
  //     random(floor(time*0.5)+10000.),
  //     1.
  //   );
  // tar = tar*2.-1.;
  // vec3 tar = vec3(0., 0., 0.);
  // vec3 target = eye - tar;
  vec3 target = vec3(0.);
  vec3 dir = lookAt(eye, target, 0.) * normalize(vec3(p.xy, 1.));
  // dir.xz *=
  // dir = vec3(p.xy,- 1.)*lookAt(eye,target, 0.);

  vec2 res = castRay(eye, dir);

  color +=
    res.y<0. ? vec3(uv.y+0.2, 0., 0.):
    res.y<1. ? vec3(0., 1., 0.) :
    res.y<2. ? vec3(1., .8, .8) :
               vec3(0.01);

  // color = vec3(1.);
  color *= calcColor(eye, dir, res.x);
  color *= clamp(5./res.x, 0., 1.);

  // color += res.x/400.;

  // color *= abs(sin(time));

  gl_FragColor = vec4(color, 1.);
  // gl_FragColor = vec4(random(uv));
}
