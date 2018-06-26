/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43218.79874);
}

float easein(float x, float n){
  return pow(x, n);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec3 c1 = vec3(0.3, 0.6, 0.9);
  vec3 c2 = vec3(0.35, 0.15, 0.75);
  vec3 c3 = vec3(0.2, 0.2, 0.3);

  for(int i=0;i<28;i++){
    float fi = float(i);

    vec2 p1 = vec2(random(vec2(0.34867*fi)), random(vec2(0.71657*fi)));
    vec2 p2 = vec2(random(vec2(0.21327*fi)), random(vec2(0.41289*fi)));
    float a = (p1.y-p2.y)/(p1.x-p2.x);
    float b = p1.y-p1.x*a;

    float hv = random(vec2(fi*4.237894))<0.5 ? 0. : 1.;// 0.:horizontal , 1.:vertical

    float thrx = (uv.y-b)/a;
    float thry = a*uv.x+b;
    float thr = hv<1. ? thrx : thry;

    float w = 0.5*sin(t*0.4)+0.5001;
    w = easein(w, 1.5);
    w *= 0.4;
    float value = smoothstep(thr-w, thr+w, hv<1.?uv.x:uv.y);

    vec2 cIndex;
    cIndex.x = floor(random(vec2(fi*6.3728, 0.))*3.);
    cIndex.y = floor(random(vec2(fi*9.1167, 1.))*3.);

    vec3 ca = cIndex.x<1. ? c1 :
              cIndex.x<2. ? c2 : c3;
    vec3 cb = cIndex.y<1. ? c1 :
              cIndex.y<2. ? c2 : c3;

    color += (1.-value)*ca + value*cb;
    color = fract(color);
  }

  gl_FragColor = vec4(color, 1.);
}
