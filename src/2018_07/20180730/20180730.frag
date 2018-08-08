/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

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

float plot(vec2 uv,float pct, float w){
  return smoothstep(pct-w,pct,uv.y)-
         smoothstep(pct,pct+w,uv.y);
}
float plot(vec2 uv,float pct){
  return plot(uv, pct, 0.02);
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
  float t = mod(time, 10.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  for(int i=0;i<3;i++){
    p.x += 0.75*sin(p.y + time*0.028 + sin(p.x*0.028 + time*0.481 + sin(p.y*0.39 + time*0.195)));
    p.y += 0.93*sin(p.x + time*0.65 + sin(p.y*0.421 + time*0.59));
    p = vec2(length(p), atan(p.y/p.x));
  }

  p *= 1.;
  color += plot(p, usin(p.x + p.y), 0.6);
  // color.r += usin(p.x*1.538 + p.y*0.793 + time);
  // color.g += usin(p.x*0.925 + p.y*0.189 + time);
  // color.b += usin(p.x*0.428 + p.y*1.642 + time);

  p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  color *= 0.5/length(p);

  gl_FragColor = vec4(color, 1.);
}
