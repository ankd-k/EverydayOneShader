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

  p *= 2.;

  for(int i=0;i<10;i++){
    float fi = float(i);
    vec2 pp = p;
    p.x = pp.x+sin(2.456*pp.y+5.13489 + time*0.1518 + sin(pp.x*0.82891 + time * 0.4358));
    p.y = pp.y+sin(1.59756*pp.x+0.093489 + time*0.31 + sin(pp.y*1.35671 + time * 0.315));
    color += plot(p, usin(usin(p.x*fi*2.3447+t*0.21)), usin(t)*0.3+0.5) * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.4, usin(time*0.7415957)*0.8+0.8);
  }

  gl_FragColor = vec4(color, 1.);
}
