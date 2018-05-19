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

#define PI 3.14159265359

void main(){
    float t = mod(time, 60.);
    vec3 pos = vec3(0.);

    float id = vertexId / vertexCount;
    float theta = id * 2.*PI*8.9;
    float x = cos(theta*4.5*sin(t*0.05));
    float y = sin(theta*2.5*sin(t*0.15));
    pos = vec3(x, y, 0.);

    gl_Position = vec4(pos, 1.);
    gl_PointSize = 1.;
    v_color = vec4(1.);
}
