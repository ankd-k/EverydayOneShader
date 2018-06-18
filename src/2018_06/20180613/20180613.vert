/*{
    "vertexCount": 1000.,
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

mat2 rotate(float r){
  return mat2(
      cos(r), -sin(r),
      sin(r), cos(r)
    );
}

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43219.465741);
}
float random(float n){
  return random(vec2(n));
}

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    float triNum = floor(vertexId/3.);
    float triId = mod(vertexId, 3.);

    vec3 p;
    p.x = sin(triNum*1.387246 + t) * sin(triNum * 2.148932);
    p.y = sin(triNum*0.513872) * sin(triNum * 1.897841 + t);
    p.z = sin(triNum*1.049721 + t) * sin(triNum * 0.459713);
    // p = p*2.-1.;

    float r = random(triNum)*0.5;
    pos.xy = p.xy + rotate(triId*PI*2./3.)*vec2(0., r);

    gl_Position = vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(0.3);
}
