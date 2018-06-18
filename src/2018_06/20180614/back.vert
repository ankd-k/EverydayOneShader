/*{
  "audio": true,
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

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    gl_Position = vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
