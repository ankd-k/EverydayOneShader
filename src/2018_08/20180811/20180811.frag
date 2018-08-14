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

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);


  uv.x += uv.y * 0.12*sin(uv.y*40. * abs(sin(t*2.))) * (uv.y*sin(t*5.));
  uv.x -= 2.*(0.5-uv.x) * (1.-uv.y);

  float pct;
  pct = usin(uv.x*10. * 2.0*PI);
  pct = pow(pct, (1.5*(uv.y+1.)));

  // color = vec3(1.-pct);
  color = vec3(pct);
  
  gl_FragColor = vec4(color, 1.);
}
