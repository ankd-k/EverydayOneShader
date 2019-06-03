/*{
  pixelRatio: 2.0,
}*/

precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

const float PI = 3.1415926;


mat2 rotate(in float r){
    float c=cos(r), s=sin(r);
    return mat2(c, -s, s, c);
}
float hash(in vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 78.233)))*46123.9878);
}
vec3 hash3(in vec2 n){
    return vec3(
            hash(n+vec2(1.0)),
            hash(n+vec2(10000.0)),
            hash(n+vec2(100.0))
        );
}
float usin(in float x){
  return 0.5+0.5*sin(x);
}
float easeInOut(in float x, in float e){
    float x2 = x*2.0;
    return x<0.5 ? 0.5*pow(x2, e) : 1.0-0.5*pow(2.0-x2, e);
}


float sdSphere(in vec3 p, in float r){
    return length(p) - r;
}
float sdPlane(in vec3 p, in float h){
    return p.y - h;
}
float sdBox(in vec3 p, in vec3 b){
    vec3 d = abs(p) - b;
    return length(max(d, 0.)) + min(max(d.x, max(d.y, d.z)), 0.);
}

float rei(in vec3 p){
    vec3 q = p;
    float res,d;

    // top obj
    q.x = abs(q.x);
    q.y -= 0.6;
    q.xy *= rotate(PI*0.25);
    d = sdBox(q, vec3(1.0, 0.1, 0.1));
    res = d;

    // point
    q = p;
    q -= vec3(0., 0.1, 0.);
    q.xy *= rotate(PI*0.25);
    d = sdBox(q, vec3(0.1));
    res = min(res,d);

    // bottom obj
    q = p;
    d = sdBox(q-vec3(0., -0.2, 0.), vec3(0.4, 0.1, 0.1));
    d = min(d, sdBox(q-vec3(0.3, -0.5, 0.), vec3(0.1, 0.2, 0.1)));
    d = min(d, sdBox(q-vec3(0.2, -0.6, 0.), vec3(0.15, 0.1, 0.1)));
    d = min(d, sdBox(q-vec3(-0.15, -0.55, 0.), vec3(0.1, 0.28, 0.1)));
    res = min(res,d);

    return res;
}
float wa(in vec3 p){
    vec3 tmp_p = p;
    vec3 q;
    float res,d;

    // nogi_hen
    p = tmp_p-vec3(-0.4, 0., 0.);
    q = p;
    d = sdBox(q-vec3(-0.02, 0.45, 0.), vec3(0.25, 0.08, 0.1));
    d = min(d, sdBox(q-vec3(0., 0.05, 0.), vec3(0.4, 0.1, 0.1)));
    d = min(d, sdBox(q-vec3(0., -0.2, 0.), vec3(0.08, 0.6, 0.1)));
    q.x = abs(q.x);
    q.xy *= rotate(PI*0.25);
    d = min(d, sdBox(q, vec3(0.5, 0.08, 0.1)));
    res = d;

    // tsukuri
    p = tmp_p-vec3(0.4, 0., 0.);
    q = p - vec3(0., -0.2, 0.);
    d = max(-sdBox(q, vec3(0.2, 0.25, 0.2)), sdBox(q, vec3(0.3, 0.35, 0.1)));
    res = min(res, d);

    return res;
}

float reiwa(in vec3 p){
    vec3 q = p;
    float t = time*0.8;
    float it = floor(t);
    float ft = fract(t);

    float d_rei = rei(q);
    float d_wa = wa(q);
    float d_reiwa = min(rei(q-vec3(-0.9, 0., 0.)), wa(q-vec3(0.8, 0., 0.)));

    float pattern = floor(mod(t, 3.0));
    float pct = easeInOut(ft, 8.0);
    return  pattern<1.0 ? mix(d_rei, d_wa, pct) :
            pattern<2.0 ? mix(d_wa, d_reiwa, pct) :
                          mix(d_reiwa, d_rei, pct);

}

vec3 opRep(in vec3 p, in vec3 c){
    return mod(p-0.5*c, c) - 0.5*c;
}

vec2 map(in vec3 p){
    vec3 q = p;

    for(int i=0;i<2;i++){
        q = abs(q) - vec3(4.0);
        q.xy *= rotate(time*0.2);
        q.yz *= rotate(time*0.3);
        q.zx *= rotate(time*0.1);
    }
    q = opRep(q, vec3(5.0+floor(q)));
    q = mix(p, q, easeInOut(usin(time*0.4), 4.0));
    vec2 res = vec2(reiwa(q), 1.0);
    return res;
}

vec2 castRay(in vec3 ro, in vec3 rd){
    float minD=0.5, maxD=20.0;
    float d = minD, m = -1.0;
    for(int i=0;i<32;i++){
        vec2 tmp = map(ro + rd*d);
        if(tmp.x<0.001 || maxD<tmp.x) break;
        d += tmp.x;
        m = tmp.y;
    }
    if(maxD<d) m = -1.0;
    return vec2(d, m);
}

vec3 calcNormal(in vec3 p){
    vec2 e = vec2(1.0, -1.0)*0.0001;
    return normalize(vec3(
            e.xyy*map(p+e.xyy).x +
            e.yxy*map(p+e.yxy).x +
            e.yyx*map(p+e.yyx).x +
            e.xxx*map(p+e.xxx).x
        ));
}

vec3 render(in vec3 ro, in vec3 rd){
  vec3 color = vec3(0.0);

  vec2 res = castRay(ro, rd);
  float d = res.x;
  float m = res.y;

  vec3 pos = ro + rd*d;
  vec3 nor = calcNormal(pos);

  vec3 lp = vec3(1.0);
  vec3 ld = normalize(lp - pos);

  color =
      m==1.0 ? mix(vec3(1.), vec3(0.1, 0.4, 0.9), exp(-0.2*length(pos-lp)))*clamp(dot(ld, nor), 0., 1.):
               vec3(1.0);

  return color;
}

mat3 lookAt(in vec3 eye, in vec3 tar, in float r){
    vec3 cw = normalize(tar - eye);
    vec3 cp = vec3(sin(r), cos(r), 0.);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    return mat3(cu, cv, cw);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float t = time*1.4 + 1.0*sin(time*0.8);
    float it = floor(t);
    float ft = fract(t);
    ft = sqrt(ft);
    vec3 ro1 = hash3(vec2(it))*2.0-1.0;
    vec3 ro2 = hash3(vec2(it+1.0))*2.0-1.0;
    vec3 roa = mix(ro1, ro2, ft)*mix(3.0, 1.0, easeInOut(clamp(time*0.1, 0., 1.), 4.0));
    vec3 rob = vec3(0., 0., 1.+usin(time*0.5));

    vec3 tar = vec3(0.);
    vec3 rda = lookAt(roa, tar, 0.)*normalize(vec3(p, 1.0));
    vec3 rdb = lookAt(rob, tar, 0.)*normalize(vec3(p, 1.0));

    vec3 colora = render(roa, rda);
    vec3 colorb = render(rob, rdb);

    vec3 color = mix(colora, colorb, easeInOut(usin(time*0.45), 6.0));

    gl_FragColor = vec4(color, 1.0);
}
