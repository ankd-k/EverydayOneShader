/*{
"vertexCount": 1000.,
"vertexMode": "POINTS",

"PASSES":[
  {
    "vs": "star.vert",
    "fs": "star.frag",
    "TARGET": "buff",
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D buff;

uniform sampler2D backbuffer;

const float PI = 3.14159265359;

varying vec4 v_color;

void main(){
    float t = mod(time*2., 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

      gl_FragColor = v_color;
      gl_FragColor *= (60.-t*1.5)/60.;
}
