/*{
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

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43213.7894);
}

float df(vec3 p){
  vec3 d = abs(p)-0.2;
  float box = min(max(d.x, max(d.y, d.z)), 0.) + length(max(d, 0.));
  return length(p) - 1. + sin(p.x*2.+time)*sin(p.y*3.+time*3.5)*sin(p.z*4.+time);
  return box;
}

bool castRay(inout vec3 ro, inout vec3 rd, out vec3 ip){
  float d = 0.;
  for(int i=0;i<64;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.0005){
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
  float d = 0.0001;
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
  float t = mod(time*0.5, 60.);
  float tl = floor(t);
  float tf = fract(t);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float pct = easeOut(tf, 5.);

  vec3 rs = 2.*PI*vec3(
      random(vec2(tl, 0.)),
      random(vec2(tl, 1.)),
      random(vec2(tl, 2.))
    );
  vec3 rg = 2.*PI*vec3(
      random(vec2(tl+1., 0.)),
      random(vec2(tl+1., 1.)),
      random(vec2(tl+1., 2.))
    );
  vec3 r = (1.-pct)*rs + pct*rg;
  r = vec3(time*0.2, time*0.3, time*0.1);
  mat3 rm = rotate(r);

  float ls = random(vec2(tl, 100.));
  float lg = random(vec2(tl+1., 100.));
  float l = (1.-pct)*ls + pct*lg;

  vec3 camPos = rm * vec3(0., 0., -2. - l);
  vec3 dir = rm*normalize(vec3(p, 1.));

  vec3 ip;
  if(castRay(camPos, dir, ip)){
    color = vec3(0.03*length(dir)) + df(ip-1.);
    color = pow(clamp(color, 0., 1.), vec3(2.));
    color += 2.;
    color = color*clamp(texture2D(backTexture, (1.-uv)+dot(normalize(dir), getNormal(ip))*0.15).rgb, 0., 1.5);
    color = abs(usin(time)-clamp(color, 0., 1.));
    // color = pow(color, vec3(.5));
  }else {
    color = texture2D(backTexture, uv).rgb*0.6;
  }

  gl_FragColor = vec4(color, 1.);
}
