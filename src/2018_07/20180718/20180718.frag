/*{
  'osc': 4000,

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D osc_hand0_tx;
uniform sampler2D osc_hand0_ty;
uniform sampler2D osc_hand0_tz;
uniform sampler2D osc_rx0;
uniform sampler2D osc_ry0;
uniform sampler2D osc_rz0;
uniform sampler2D osc_tx1;
uniform sampler2D osc_ty1;
uniform sampler2D osc_tz1;
uniform sampler2D osc_rx1;
uniform sampler2D osc_ry1;
uniform sampler2D osc_rz1;

const float PI = 3.14159265359;

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}

vec3 opRep(vec3 p, vec3 c){
  return mod(p, c)-0.5*c;
}

vec3 opRot(vec3 p, vec3 r){
  p.xy *= rotate(r.z);
  p.yz *= rotate(r.x);
  p.zx *= rotate(r.y);
  return p;
}

float dfSphere(vec3 p, float r){
  return length(p)-r;
}

float df(vec3 p){
  vec2 uv = gl_FragCoord.xy/resolution;
  if(p.x<0.){
    p += vec3(
        texture2D(osc_hand0_tx, uv).r,
        texture2D(osc_hand0_tz, uv).r,
        -texture2D(osc_hand0_ty, uv).r
      )*5.;
    // p = opRot(p, vec3(
    //     texture2D(osc_rx0, uv).r,
    //     texture2D(osc_ry0, uv).r,
    //     texture2D(osc_rz0, uv).r
    //   )/360.*2.*PI);
  }else{
    p += vec3(
        texture2D(osc_tx1, uv).r,
        texture2D(osc_tz1, uv).r,
        -texture2D(osc_ty1, uv).r
      )*5.;
    // p = opRot(p, vec3(
    //     texture2D(osc_rx1, uv).r,
    //     texture2D(osc_ry1, uv).r,
    //     texture2D(osc_rz1, uv).r
    //   )/360.*2.*PI);

  }
  p = opRep(p, vec3(2.));
  return dfSphere(p, 0.3);
}

bool castRay(inout vec3 ro, inout vec3 rd){
  float minD = 0.;
  float maxD = 200.;

  float d = 0.;
  for(int i=0;i<32;i++){
    float tmp = df(ro + rd*d);
    if(tmp<0.0001){
      rd = rd*d;
      return true;
    }
    if(maxD<tmp) return false;
    d += tmp;
  }
  return false;
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 camPos = vec3(0., 0., -t);
  vec3 dir = normalize(vec3(p, 1.));

  if(castRay(camPos, dir)){
    color += vec3(0.01 * length(dir)) + df(camPos+dir -0.2);
    color *= 2.;
  }else{
    color = vec3(0.7, 0.7, 0.1);
  }

  gl_FragColor = vec4(color, 1.);
}
