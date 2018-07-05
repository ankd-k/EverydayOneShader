/*{
pixelRatio: 1.,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

float plot(vec2 p, float pct, float w){
  return smoothstep(pct-w, pct, p.y)-smoothstep(pct, pct+w, p.y);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  p *= 5.;

  for(int i=0;i<5;i++){
    float fi = float(i);
    vec2 pp = p*0.8;
    p.x = pp.x+sin(1.56*pp.y + time*.01518 + sin(pp.x*.182891 + time * .0104358));
    p.y = pp.y-sin(.556*pp.x + time*0.01031 + sin(pp.y*0.035671 + time * 0.04615));
    color.r += plot(p*1.2, usin(p.x*2.3897*usin(p.y*fi*3.3447+t*.821)), usin(t)*0.3+0.4);// * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.8, usin(time*0.7415957)*0.6+0.5);
    color.g += plot(p*0.5, usin(p.x*3.821576*usin(p.y*fi*1.3482+t*1.21)), usin(t)*0.5+0.7);// * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.8, usin(time*0.7415957)*0.6+0.5);
    color.b += plot(p*1.4, usin(p.x*1.38*usin(p.y*fi*1.34+t*1.21)), usin(t)*0.1+0.2);// * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.8, usin(time*0.7415957)*0.6+0.5);
  }

  color = clamp(color, 0., 1.);
  gl_FragColor = vec4(color, 1.);
}
