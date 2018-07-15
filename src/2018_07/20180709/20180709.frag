precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float easein(float x, float n){
  return pow(x, n);
}
float easeout(float x, float n){
  return 1.-pow(1.-x, n);
}
float easeinout(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easein(x2, n) : 0.5+0.5*easeout(x2-1., n);
}
float easeoutin(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easeout(x2, n) : 0.5+0.5*easein(x2-1., n);
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

float dfCylinder( vec3 p, vec3 c){
  return length(p.xz-c.xy) - c.z;
}

float df(vec3 p){
  p.y *= 0.8;
  float tmp = mod(floor(p.y), 2.)<1. ? fract(p.y) : 1.-fract(p.y);
  float cy1 = dfCylinder(p, vec3(cos(p.y), sin(p.y), 0.2 + easeoutin(tmp, 3.)*0.7));
  return cy1;
}

bool castRay(inout vec3 ro, inout vec3 rd){
  float mind = 0.;
  float maxd = 5000000.;

  float d = mind;
  for(int i=0;i<32;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.01){
      rd = rd*d;
      return true;
    }
    d += tmp;
    if(maxd<d) return false;
  }
  return false;
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

  vec3 camPos = vec3(cos(t*2.)*2., t, sin(t*2.)*2.);
  vec3 target = vec3(sin(t * 1.245), sin(t*1.3249)+(t+1.)*10., sin(t*2.98741)) * 0.1;
  mat3 rotMat = lookAt(camPos, target, 0.);
  vec3 dir = rotMat * normalize(vec3(p, 1.));
  // vec3 dir = normalize(vec3(p, 1.));


  if(castRay(camPos, dir)){
    color += vec3(0.03*length(dir))+df(camPos+dir-.5);
    color *= vec3(0.8, 1.2, 1.5);
  }else{
    color = vec3(0.8, 0.8, 0.1);
  }

  gl_FragColor = vec4(color, 1.);
}
