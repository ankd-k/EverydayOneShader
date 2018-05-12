/*{
    "vertexCount": 1000.,
    "vertexMode": "LINES",

    "PASSES":[
        {
            BLEND : "ADD",
        },
    ]
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
    float t = mod(time, 600.);
    vec3 pos = vec3(0.);

    float id = vertexId/2.;
    float n = mod(vertexId, 2.);

    float theta = id*0.12 + n*PI + t;
    vec2 r = vec2(0.);
    r.x = cos(id*1.8+t*1.2);
    r.y = sin(id*1.2+t*2.4);

    float x = r.x*cos(theta);
    float y = r.y*sin(theta);

    pos = vec3(x,y,sin(id*0.01));


    gl_Position = vec4(pos, 1.);
    gl_Position.x *= resolution.y/resolution.x;
    gl_PointSize = 1.;
    v_color = vec4(vec3(0.1,0.3,0.8),1.);
}
