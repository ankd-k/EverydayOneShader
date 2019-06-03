/*{
  audio: true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;

const float PI = 3.14159265359;

vec3 opRep(vec3 p, vec3 c){
  return mod(p, c)-0.5*c;
}

float dfSphere(vec3 p, float r){
  p = opRep(p, vec3(16.));
  return length(p)-r;
}

float df(vec3 p){
  return dfSphere(p, 0.2+volume*0.1);
}

bool castRay(inout vec3 ro, inout vec3 rd){
  float minD = 0.;
  float maxD = 40.;
  float thr = 0.0001;

  float d = minD;
  for(int i=0;i<32;i++){
    float tmp = df(ro + rd*d);
    if(tmp<thr){
      rd *= d;
      return true;
    }
    else if(maxD<tmp){
      return false;
    }
    d += tmp;
  }
  return false;
}

vec3 getNormal(vec3 p){
  float ep = 0.0001;
  return normalize(vec3(
      df(p+vec3(ep, 0., 0.))-df(p-vec3(ep, 0., 0.)),
      df(p+vec3(0., ep, 0.))-df(p-vec3(0., ep, 0.)),
      df(p+vec3(0., 0., ep))-df(p-vec3(0., 0., ep))
    ));
}

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 ro = vec3(0., 0., -time*10.);
  vec3 rd = normalize(vec3(p, -1.));
  rd.xy *= rotate(sin(time*0.2));

  if(castRay(ro, rd)){
    float d = length(rd);
    vec3 ip = ro+rd;

    vec3 normal = getNormal(ip);

    vec3 lightPos = vec3(1.);
    vec3 lightDir = normalize(ip - lightPos);
    lightDir = vec3(1.0);

    float diff = dot(normal, lightDir);
    color += clamp(diff, 0.1, 1.0);
    // color += 1.;
  }

  gl_FragColor = vec4(color, 1.);
}
