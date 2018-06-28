/*{


"PASSES":[
  {
    fs: "scene1.frag",
    TARGET: "tex1",
  },
  {
    fs: "scene2.frag",
    TARGET: "tex2",
  },
  {

  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D tex1;
uniform sampler2D tex2;

const float PI = 3.14159265359;

float easein(float x, float n){
  return pow(x, n);
}
float easeout(float x, float n){
  return 1.-pow(1.-x, n);
}
float easeinout(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easein(x2,n) : 0.5+0.5*easeout(x2-1., n);
}
float easeoutin(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easeout(x2,n) : 0.5+0.5*easein(x2-1., n);
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898,4.1414)))*43124.9879);
}

vec2 initP(float seed){
  float r = length(resolution/min(resolution.x, resolution.y));
  float theta = 2.*PI*random(vec2(seed));
  return vec2(r*cos(theta), r*sin(theta));
}

void main(){
  float t = mod(time*0.5, 1.);
  float tl = floor(t);
  float tf = fract(t);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // get 2 scene
  vec3 c1 = texture2D(tex1, uv).rgb;
  vec3 c2 = texture2D(tex2, uv).rgb;
  vec3 cs = mod(tl, 2.)<1. ? c1 : c2;
  vec3 cg = mod(tl, 2.)<1. ? c2 : c1;

  // calc border
  vec2 ps = initP(tl+1.);
  vec2 pg = -ps;

  float pct = easeoutin(tf, 4.);
  vec2 pe = (1.-pct)*ps + pct*pg;

  vec2 v = normalize(pg-ps);
  float a = v.y/v.x;
  a = -1./a;
  float b = pe.y - a*pe.x;

  float y = p.x*a + b;

  // set scene
  color += ps.y<pg.y ?
    ( y<p.y ? cs : cg) :
    ( y<p.y ? cg : cs) ;

  // post effect
  // color *= 1.5 - length(p)*0.6;
  // color *= 0.8/length(p*0.5);

  gl_FragColor = vec4(color, 1.);
}
