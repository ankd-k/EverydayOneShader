/*{
    "vertexCount": 30.,
    "vertexMode": "TRIANGLES",
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

const float PI = 3.14159265359;

float ease_in(float x, float n){
  return pow(x, n);
}
float ease_out(float x, float n){
  return 1.-pow(1.-x, n);
}
float ease_inout(float x, float n){
  float x2 = x*2.;
  return x2<1. ? 0.5*ease_in(x2, n) :
                 0.5+0.5*ease_out(x2-1., n) ;
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43123.98798);
}
float random(float n){
  return random(vec2(n));
}

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

void main(){
    float t = mod(time, 60.);
    float tl = floor(t);
    float tf = fract(t);

    vec3 pos = vec3(0.);

    float triNum = floor(vertexId/3.);
    float triId = mod(vertexId, 3.);

    vec2 pos1 = vec2(random(vec2(triNum, tl)), random(vec2(triNum, tl+100.)));
    vec2 pos2 = vec2(random(vec2(triNum, tl+1.)), random(vec2(triNum, tl+101.)));


    float pct5 = ease_out(tf, 8.);

    pos.xy = pct5*pos2 + (1.-pct5)*pos1;
    // float theta = pct5*+(1.-pct5)*tf;
    float theta = pct5*random(vec2(triNum, tl+163.)) + (1.-pct5)*random(vec2(triNum, tl+162.));
    theta *= 20.*PI;
    // theta = 0.;
    float r = pct5*random(vec2(triNum, tl+163.)) + (1.-pct5)*random(vec2(triNum, tl+162.));
    r *= 0.8;
    r = pow(r, 4.);
    pos.xy += rotate(theta + triId*PI*2./3.)*vec2(0., r);
    pos.xy = pos.xy*2.-1.;

    pos.z = 0.;

    gl_Position = vec4(pos, 1.);
    gl_PointSize = 1.;


    vec3 color;
    color.r = pct5*random(vec2(triNum, tl+13.)) + (1.-pct5)*random(vec2(triNum, tl+12.));
    color.g = pct5*random(vec2(triNum, tl+123.)) + (1.-pct5)*random(vec2(triNum, tl+122.));
    color.b = pct5*random(vec2(triNum, tl+183.)) + (1.-pct5)*random(vec2(triNum, tl+182.));
    v_color = vec4(color, 1.);
}
