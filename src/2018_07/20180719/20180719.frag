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

vec2 st = uv;
for(int i=0;i<3;i++){
  st.x += usin(st.y * 4.34564 + time + sin(st.x * 10.676 + time));
  st.y += usin(st.x * 2.57489 + time + sin(st.y * 10.676 + time));
}

color = vec3(usin(st.x + t), usin(st.y + t), usin(st.x*0.83897 + t*5.264));

  gl_FragColor = vec4(color, 1.);
}
