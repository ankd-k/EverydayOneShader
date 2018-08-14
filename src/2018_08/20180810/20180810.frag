/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
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
  // p.x -= 1.;
  // p = opRep(p, vec3(4.));
  p = opRep(p, vec3(4.));
  vec3 pb = p;
  vec3 pt = p;
  // p += vec3(0., 0., 0.);
  // p.xz *= rotate(0.5*time);
  for(int i=0;i<3;i++){
    pb = abs(pb);
    pb.xz *= rotate(time*0.3);
    pb.xy *= rotate(time*0.2);
    pb.yz *= rotate(time*0.4);
  }
  // pb *= 1.+0.5*usin(time*3.);

  float pct = ease_out(fract(time*0.5), 3.6);
  pct = mod(time, 4.)<2. ? pct : 1.-pct;

  vec3 rs = vec3(0.9, 0.5, -0.2);
  vec3 rg = vec3(0.2, 0.8, 0.6);
  vec3 r = (1.-pct)*rs + pct*rg;

  for(int i=0;i<3;i++){
    pt = abs(pt);
    pt.xz *= rotate(r.y);
    pt.xy *= rotate(r.z);
    pt.yz *= rotate(r.x);
  }
  vec2 res = vec2(dfBox(pb+vec3(.0, 0., 0.), vec3(0.5+0.5*usin(time))), 1.);
  res = opU(res, vec2(dfTorus(pt+vec3(0.1), vec2(2., 0.08)), 2.));
  return res;
}

vec2 castRay(in vec3 ro, in vec3 rd){
  float minD = 0.;
  float maxD = 50.;
  #if 1
      // bounding volume
      float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) maxD = min( maxD, tp1 );
      float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) minD = max( minD, tp2 );}
  #endif
  float d = minD;
  float m = -1.;
  for(int i=0;i<64;i++){
    float precis = 0.0004*d;
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
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 eye = vec3(0., 0., time);
  vec3 target = eye -
    vec3(0., 0.5*sin(time*0.3), 1.);
  vec3 dir = lookAt(eye, target, 0.) * normalize(vec3(p.xy, -1.));
  // dir.xz *=
  // dir = vec3(p.xy,- 1.)*lookAt(eye,target, 0.);

  vec2 res = castRay(eye, dir);

  color +=
    res.y<0. ? vec3(0.):
    res.y<1. ? vec3(1., 0., 0.) :
    res.y<2. ? vec3(1.5, 1.3, 0.5) :
               vec3(1.);

  color *= calcColor(eye, dir, res.x);
  color *= clamp(5./res.x, 0., 1.);
  color += res.x/30.;

  // color *= abs(sin(time));

  gl_FragColor = vec4(color, 1.);
}
