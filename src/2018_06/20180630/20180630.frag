/*{
  IMPORTED: {
    'img':{
      PATH: 'ground.jpeg',
    },
  },
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D img;
uniform sampler2D night;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

float plot(vec2 p, float pct, float w){
  return smoothstep(pct-w, pct, p.y)-smoothstep(pct, pct+w, p.y);
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43132.1597);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);
  // vec3 color = vec3(random(p))*vec3(0.3,0.2,0.1);

  p *= 0.8;
  p += vec2(sin(time*0.39137945), sin(time*0.2247416));
  p += vec2(t*0.35, 0.);

  for(int i=0;i<5;i++){
    float fi = float(i);
    vec2 pp = p;
    p.x = pp.x+sin(2.456*pp.y+0.3489 + time*0.1518 + sin(pp.x*0.82891 + time * 0.4358 + sin(pp.y*1.241 + t*3.12647)*0.8));
    p.y = pp.y+sin(1.59756*pp.x+0.093489 + time*0.31 + 2.*sin(pp.y*1.35671 + time * 10.0315 + sin(pp.x*2.6841 + t*0.08 + sin(pp.y*0.817*fi+time*0.661))));
    color += plot(p, usin(p.x*fi*.02197*usin(p.y*fi*2.3447+t*0.21)), usin(t)*.8+0.9) * vec3(usin(time*0.81598)*0.3+0.2, usin(time*0.349741)*0.8+0.4, usin(time*0.7415957)*0.8+0.8);
  }

  gl_FragColor = texture2D(img, uv+color.zy*0.02 + vec2(sin(uv.x*1.451+time*6.3), sin(uv.x*1.862+time*1.3 + sin(uv.y*0.489 + time*.156)))*0.01)*0.6;
  // gl_FragColor += vec4(color*0.1, 1.);
}
