/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float dfSphere(vec3 p, float r){
  return length(p) - r;
}

vec2 df(vec3 p){
  float m = 0.;
  float s = dfSphere(p, 0.2);
  return vec2(s, 1.);
}

vec2 castRay(inout vec3 ro, inout vec3 rd){
  float minD = 0.;
  float maxD = 20.;
  float thr = 0.001;

  float d = minD;
  for(int i=0;i<32;i++){
    vec2 tmp = df(ro + rd*d);
    if(tmp.x<thr){
      rd = rd*d;
      return tmp;
    }
  }
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  gl_FragColor = vec4(color, 1.);
}
