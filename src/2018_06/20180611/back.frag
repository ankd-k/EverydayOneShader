/*{
  "audio": true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float volume;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);


    color = vec3(0.,0.05,0.1);
    float pct = (usin(t*0.692)+usin(t*1.934)+usin(t*3.289))+0.05;
    color *= pct*4./length(p);

    gl_FragColor = vec4(color, 1.);
}
