/*{
    "vertexCount": 1000.,
    "vertexMode": "POINTS",
}*/
precision mediump float;

attribute float vertexId;
uniform float vertexCount;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec4 v_color;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43235.879);
}

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

void main(){
    float t = mod(time*2., 60.);
    vec3 pos = vec3(0.);

    pos.x = random(vec2(vertexId, 0.));
    pos.y = random(vec2(vertexId, 100.));
    pos.z = 0.;
    pos = pos*2.-1.;
    pos.xy *= rotate(-t*0.01);
    pos.xy *= 2.*sqrt(2.);
    pos.y -= 1.;
    pos.x -= sin(t*0.1)*0.4;

    pos.z = 0.;

    gl_Position = vec4(pos, 1.);
    gl_PointSize = random(vec2(vertexId, 1000.))*3.;
    v_color = vec4(1.);
    // gl_PointSize = 10.;
}
