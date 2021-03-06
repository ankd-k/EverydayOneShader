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
    uv.x += 0.1*sin(uv.y*0.82 - time*1.359 + sin(uv.x*5.196 + time*0.947 + sin(uv.x*15.893 + time*0.412)));
    uv.y += 0.3*sin(uv.x*2.82 + time*0.359 - sin(uv.y*4.196 + time*5.547));
  }
  uv = uv*2.-1.;
  uv = abs(uv);
  color.r = sin(uv.x*0.25 + uv.y*0.149);
  color.g = sin(uv.x*0.83 + uv.y*0.0129);
  color.b = sin(uv.x*0.59 + uv.y*0.59);

  gl_FragColor = vec4(color, 1.);
}
