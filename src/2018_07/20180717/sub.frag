/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
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


void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  uv.y *= 100.;
  float y = usin(uv.y+t);

  float pct = ease_in(fract(t+(uv.x*3.+uv.y)*0.1), 2.);
  y *= pct;

  gl_FragColor = vec4(pow(y, 10.));

}
