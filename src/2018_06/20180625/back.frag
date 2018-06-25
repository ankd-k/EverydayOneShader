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
float ucos(float x){
  return 0.5+0.5*cos(x);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  for(int i=0;i<4;i++){
    float fi = float(i);
    p.x += fi*sin(p.y*3. + t*0.1 + cos(p.y*3. + fi*t*0.2));
    p.y += fi*sin(p.x*1. + t*0.2 + cos(p.x*3. + fi*t*0.2));
    // p.y += 1.48/sin(fi*0.25+p.x*cos(p.x*0.067));
  }
  // p *= 10.;

  color.g += usin(p.x+p.y+0.1);//*usin(p.y*2.176);
  color.b += usin(p.x+p.y+0.05);//*usin(p.y*2.176);
  color.r += usin(p.x+p.y+0.2)+ucos(p.x+p.y+0.38);//*usin(p.y*2.176);

  color = 1.-color;

  gl_FragColor = vec4(color, 1.);
}
