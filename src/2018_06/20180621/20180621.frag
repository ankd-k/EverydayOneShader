/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898,4.1414)))*43132.7894);
}
float random(float n){
  return random(vec2(n, 73.45167));
}
vec2 random2(vec2 n){
  return vec2(
      random(n + vec2(0., 0.)),
      random(n + vec2(1., 0.))
    );
}
vec3 random3(vec2 n){
  return vec3(
      random(n + vec2(0., 0.)),
      random(n + vec2(1., 0.)),
      random(n + vec2(2., 0.))
    );
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(1.0);

    vec2 p1 = random2(vec2(0.587, 5.2465));
    vec2 p2 = random2(vec2(40.468741, 74.23897));
    vec2 p3 = random2(vec2(922.4677, 357.145625));

    float l1 = usin(length(p1-uv)*10.-t*3.4651);
    float l2 = usin(length(p2-uv)*10.+t*4.1267);
    float l3 = usin(length(p3-uv)*10.-t*5.987643);

    color = l1>0.5?vec3(l1,0.,0.):color;
    color = l2>0.5?vec3(0.,l2,0.):color;
    color = l3>0.5?vec3(0.,0.,l3):color;

    gl_FragColor = vec4(color, 1.);
}
