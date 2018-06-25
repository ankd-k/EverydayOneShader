/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float speed = 0.8;
  p = gl_FragCoord.xy * 0.002;
  for(int i=1; i<20; i++){
      float float_i = float(i);
      p.x+=0.3/float_i*sin(float_i*4.*p.y+time*speed+cos((time/(100.*float_i))*float_i))+mouse.x/10.;
      p.y+=0.4/float_i*cos(float_i*3.*p.x+time*speed+sin((time/(200.*float_i))*float_i))+mouse.y/10.;
  }

  float r = cos(p.x+p.y+2.)*.5+.5;
  float g = sin(p.y+p.y+2.)*.5+.5;
  float b = (sin(p.x+p.y+1.)+cos(p.x+p.y+1.))*.3+.5;

  color = vec3(r,g,b);
  color = color.ggr;

  gl_FragColor = vec4(color, 1.);
}
