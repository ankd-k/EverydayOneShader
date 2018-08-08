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

  uv = abs(uv*2.-1.);
  float l = 1.-length(uv + 1.38*vec2(sin(uv.x*185.387 + t + sin(uv.x*123.47)), sin(uv.y *43.982 + t + sin(uv.x*112.8749))));

  color += pow(l, 10.);
  // color = 1.-color;

  gl_FragColor = vec4(color, 1.);
}
