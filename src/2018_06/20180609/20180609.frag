/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float noise(vec3 n){
  vec2 uv = n.xy;
  float seed = n.z;

  float res=0.;
  for(int i=0;i<20;i++){
    float fi = float(i);
    vec2 pos;
    pos.x = 0.5+0.5*sin(fi*1.10546 + seed*0.091876*fi*0.1);
    pos.y = 0.5+0.5*sin(fi*5.39245 + seed*0.035192*fi*0.1);
    res += (0.5+0.5*sin(fi+seed*0.5))*0.5/length(uv-pos);
  }
  res *= 0.08;
  res = clamp(res, 0., 1.);
  res = pow(res, 4.);
  return res;
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    color.r += noise(vec3(uv, t));
    color.g += noise(vec3(uv, t+100.));
    color.b += noise(vec3(uv, t+200.));

    // color = vec3(noise(vec3(uv, t)));

    gl_FragColor = vec4(color, 1.);
}
