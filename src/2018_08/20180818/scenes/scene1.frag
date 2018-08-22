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

  for(int i=0;i<3;i++){
    uv.x += 0.2*sin(uv.y*2.82 + time*0.359 + sin(uv.x*25.196 + time*0.947 + sin(uv.x*5.893 + time*0.412)));
    uv.y += 0.2*sin(uv.x*23.82 + time*0.359 + sin(uv.y*45.196 + time*0.547));
  }
  color.r = sin(uv.x*.5 + uv.y*.69);
  color.g = sin(uv.x*2.5 + uv.y*.49);
  color.b = sin(uv.x*1.5 + uv.y*.89);

  gl_FragColor = vec4(color, 1.);
}
