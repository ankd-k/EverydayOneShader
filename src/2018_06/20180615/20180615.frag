/*{

}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D backbuffer;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}
float ucos(float x){
  return 0.5+0.5*cos(x);
}

mat2 rotate(float r){
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43213.9879);
}

float easeIn(float x, float n){
  return pow(x, n);
}
float easeOut(float x, float n){
  return 1.-pow(1.-x, n);
}
float easeInOut(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*easeIn(x2, n) : 0.5+0.5*easeOut(x2-1., n);
}

vec2 fold(vec2 p, float ang){
  vec2 n=vec2(cos(-ang),sin(-ang));
  p -= 2.*min(0.,dot(p,n))*n;
  return p;
}
vec2 koch_fold(vec2 p) {
  // Fold horizontally
  p.x = abs(p.x);
  p.x-=.5;
  //Fold across PI/6
  p = fold(p,PI/6.);
  return p;
}
vec2 koch_curve(vec2 p) {
  //Fold and scale a few times
  for(int i=0;i<5;i++){
    p*=3.;
    p.x-=1.5;
    p=koch_fold(p);
  }
  return p;
}


float d2hline(vec2 p){
  // p.x -= max(0.,min(1.,p.x));
  float tl = floor(time*1.);
  float a = random(vec2(tl, 0.));
  // float tf = fract(time);
  p.x -= clamp(p.x, 0., 1.);
  return length(p)*(0.5);
}
vec3 res2(vec2 p, float n) {
  p = p*n;
  p -= vec2(.5,.3);
  p = fold(p, -2.*PI/3.);
  p.x += 1.;
  p = fold(p, -PI/3.);
  p = koch_curve(p);
  return vec3(d2hline(p)/5.);
}

void main(){
    float t = mod(time, 60.);
    float tf = fract(t);
    float tl = floor(t);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    float pct = easeInOut(tf, 3.);

    float theta1 = random(vec2(tl, 0.));
    float theta2 = random(vec2(tl+1., 0.));
    float theta = pct*theta2 + (1.-pct)*theta1;
    theta *= 2.*PI;

    p *= rotate(theta);

    for(int i=1;i<9;i++){
      float r1 = random(vec2(float(i)+tl, 0.));
      float r2 = random(vec2(float(i)+tl+1., 0.));
      float r = pct*r2 + (1.-pct)*r1;
      color += clamp(1.-res2(p, float(i)*r), 0., 1.);
      p *= rotate(float(i)*1.*usin(time*0.8));
    }
    // color = color;

    gl_FragColor = vec4(color, 1.);
    // gl_FragColor.rgb += texture2D(backbuffer, uv).rgb*0.8;
}
