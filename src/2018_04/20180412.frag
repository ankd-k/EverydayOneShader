/*{
  "glslify": true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#pragma glslify:

void main(){
  float t = mod(time*4., 60.);
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  p *= 20.;
  vec2 l = floor(p);
  l = abs(l);

  float count = l.x + l.y;

  // color.r += sin(count*0.4+t);
  // color.g += sin(count*0.5+t);
  // color.b += sin(count*0.6+t);
  color += sin(count*0.2+t);
  gl_FragColor = vec4(color, 1.);
}
