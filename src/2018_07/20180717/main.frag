/*{
  audio: true,
  pixelRatio: 2.,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;

const float PI = 3.14159265359;

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float lengthN(vec3 p, float n){
  vec3 q = pow(p, vec3(n));
  return pow(q.x+q.y+q.z, 1./n);
}
float lengthN(vec2 p, float n){
  vec2 q = pow(p, vec2(n));
  return pow(q.x+q.y, 1./n);
}

float dfTorus82(vec3 p, vec2 t){
  vec2 q = vec2(lengthN(p.xz, 32.)-t.x, p.y);
  return lengthN(q, 8.)-t.y;
}

vec3 opRot(vec3 p, vec3 r){
  vec3 q = p;
  q.xy *= rotate(r.z);
  q.yz *= rotate(r.x);
  q.zx *= rotate(r.y);
  return q;
}

float df(in vec3 p){
  vec2 t = vec2(0.8, 0.2);
  // p *= 0.8+sin(time*2.)*0.2;
  p = opRot(p, vec3(time*0.1));

  float res = 100000.;
  for(int i=0;i<10;i++){
    float fi = float(i);
    float freq = texture2D(spectrum, vec2(fi*0.05, 0.)).r;
    res = min(res, dfTorus82(p+vec3(0., 2.*t.y*fi-t.y*5., 0.), vec2(freq+0.2, 0.1)));
  }
  return res;
}

bool castRay(inout vec3 ro, inout vec3 rd){
  float maxD = 20.;
  float minD = 0.;

  float d = minD;
  for(int i=0;i<32;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.02){
      rd = rd*d;
      return true;
    }
    // if(tmp>maxD) return false;
    d += tmp;
  }
  return false;
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 camPos = vec3(0., cos(t), sin(t))*2.;
  camPos = vec3(0., 0., -2.);
  vec3 dir = normalize(vec3(p, 1.));
  dir.yz *= rotate(t);


  if(castRay(camPos, dir)){
      color += vec3(0.03*length(dir)) + df((camPos + dir)-0.1);
      color *= 1.4;
      gl_FragColor = vec4(color, 1.);
  }else{
    // color += texture2D(spectrum, 1.-abs(uv*2.-1.)).r;
    gl_FragColor = vec4(0.);
  }
}
