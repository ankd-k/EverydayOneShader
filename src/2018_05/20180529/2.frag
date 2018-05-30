/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.98798);
}

float ease_in(float x){
  return pow(x, 1.2);
}

float random(vec3 n){
  return fract(sin(dot(n.xy, vec2(12.9898,4.1414))
                  *dot(n.yz, vec2(12.9898,4.1414))
                  *dot(n.zx, vec2(12.9898,4.1414))
                  )*43213.98789);
}

void main(){
    float t = mod(time, 60.);
    float tf = fract(t);
    float tl = floor(t+ease_in(tf)*16.);
    t *= tf;
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    p *= 2.;
    vec2 pl = floor(p);

    float n = random(vec3(pl, tl));

    if(n<0.3) color = vec3(1.,0.,0.);
    else if(n<0.6) color = vec3(0.,1.,0.);
    else if(n<0.9) color = vec3(0.,0.,1.);
    else color = vec3(0.);

    color *= 0.5;

    gl_FragColor = vec4(color, 1.);
}
