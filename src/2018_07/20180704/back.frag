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

float plot(vec2 p, float pct, float w){
  return smoothstep(pct-w, pct, p.y)-smoothstep(pct, pct+w, p.y);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  p *= 1.;

  for(int i=0;i<5;i++){
    float fi = float(i);
    vec2 pp = p*0.9;
    p.x = pp.x+sin(6.56*pp.y + time*.01518 + sin(pp.x*.182891 + time * .14358));
    p.y = pp.y-sin(2.556*pp.x + time*0.031 + sin(pp.y*0.835671 + time * 0.4615));
    color.r += plot(p, usin(p.y*usin(p.x*fi*9.3447+t*0.821)), usin(t)*0.2+0.2);// * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.8, usin(time*0.7415957)*0.6+0.5);
    color.g += plot(p, usin(p.x*usin(p.x*fi*1.3482+t*10.21)), usin(t)*0.5+0.6);// * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.8, usin(time*0.7415957)*0.6+0.5);
    color.b += plot(p, usin(p.y*usin(p.x*fi*7.34+t*15.21)), usin(t)*0.6+0.8);// * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.8, usin(time*0.7415957)*0.6+0.5);
  }

  color = clamp(color, 0., 1.);
  gl_FragColor = vec4(color, 1.);
}
