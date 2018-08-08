/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int FRAMEINDEX;

const float PI = 3.14159265359;

float random(float n){
  return fract(sin(n)*43123.45892);
}
float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898,4.1414)))*43123.9789);
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

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
  float t = mod(time, 10.);

  float ft = fract(t);
  float it = floor(t);

  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  uv *= 5.;
  vec2 iuv = floor(uv);
  vec2 fuv = fract(uv);

  // color += random(iuv.x+t*0.00005);
  float rand = random(iuv+t*0.000008);
  rand = pow(rand, 8.);
  color += rand * vec3(random(uv.y*0.05+t*0.00005));


  gl_FragColor = vec4(color, 1.);
}
