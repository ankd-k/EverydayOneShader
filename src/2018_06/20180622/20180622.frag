/*{
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D buff;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    for(int i=1;i<4;i++){
      float fi = float(i);
      vec2 m = vec2(cos(t+fi*fi), sin(t+fi*fi))*fi*0.15+0.5;
      vec2 v = uv - m;
      vec2 n = normalize(v);
      float min = 0.; float max = 0.3;
      float l = clamp(0.3/length(v), min, max);
      p -= n*l;
    }
      color += smoothstep(0.8,1.,usin(p.y*2.*PI * 20.));
      color += smoothstep(0.8,1.,usin(p.x*2.*PI * 20.));
      gl_FragColor = vec4(color, 1.);
}
