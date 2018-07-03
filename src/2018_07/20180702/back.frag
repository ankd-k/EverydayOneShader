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

  for(int i=0;i<10;i++){
    float fi = float(i);
    vec2 pp = p*0.8;
    p.x = pp.x+sin(5.56*pp.y+5.13489 + time*1.1518 + sin(pp.x*.82891 + time * 1.4358));
    p.y = pp.y-sin(1.59756*pp.x+1.093489 + time*0.31 + sin(pp.y*0.35671 + time * 0.15));
    color += plot(p, usin(usin(p.x*fi*5.3447+t*0.21)), usin(t)*0.7+0.5) * vec3(usin(time*0.81598)*0.1+0.8, usin(time*0.349741)*0.2+0.6, usin(time*0.7415957)*0.4+0.3);
  }

  color = clamp(color, 0., 1.);
  gl_FragColor = vec4(color, 1.);
}
