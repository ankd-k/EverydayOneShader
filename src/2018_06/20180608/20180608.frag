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
    vec3 color = vec3(0.);

    color.r = usin(uv.x*4.01809+t*3.0579) + usin(uv.y*2.958852+t*5.1873);
    color.g = usin(uv.x*3.53487+t*4.7843) + usin(uv.y*1.897413+t*2.81);
    color.b = usin(uv.x*6.07891+t*3.3495) + usin(uv.y*2.5385791 + t*1.57);

    gl_FragColor = vec4(color, 1.);
}
