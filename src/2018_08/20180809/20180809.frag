/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

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
  p = opRep(p, vec3(2.));
  // p += vec3(0., 0., 0.);
  // p.xz *= rotate(3.14159);
  for(int i=0;i<5;i++){
    p = abs(p);
    p.xz *= rotate(-0.3 + 0.3*sin(time));
    p.xy *= rotate(2.*PI*fract(time*0.1));
    p.yz *= rotate(0.3 + 0.8*cos(0.8*time));
    // p = p*2.-1.;
  }
  // p = mod(p, vec3(8.));
  // p = opTx(p, vec3(0.), vec3(1.));
  // vec2 res = vec2(dfSphere(p, .2), 0.);
  vec2 res = vec2(dfBox(p+vec3(.1, 0., 0.), vec3(0.75)), 1.);
  // res = opU(res, vec2(dfTorus(p, vec2(0.75, 0.1)), 2.));
  return res;
}

vec2 castRay(in vec3 ro, in vec3 rd){


  float minD = 0.;
  float maxD = 20.;
  // #if 1
  //     // bounding volume
  //     float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) maxD = min( maxD, tp1 );
  //     float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) minD = max( minD, tp2 );}
  // #endif
  float d = minD;
  float m = -1.;
  for(int i=0;i<48;i++){
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
  col += clamp(1.0 + dot(rd, nor), 0.0, 1.0)*mix(vec3(1), vec3(1.0, 0.3, 0.3), 1.0);
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
  vec3 target = eye - vec3(1., 0., 1.);
  vec3 dir = lookAt(eye, target, 0.) * normalize(vec3(p.xy, -1.));
  // dir.xz *=
  // dir = vec3(p.xy,- 1.)*lookAt(eye,target, 0.);

  vec2 res = castRay(eye, dir);

  color +=
    res.y<0. ? vec3(0.):
    res.y<1. ? vec3(1., 0., 0.) :
    res.y<2. ? vec3(0.05, 1., 1.) :
               vec3(0., 0., 1.);

  color *= calcColor(eye, dir, res.x);
  // color *= (1./res.x);

  // color *= abs(sin(time));

  gl_FragColor = vec4(color, 1.);
}
