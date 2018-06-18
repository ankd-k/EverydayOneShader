/*{
"vertexCount": 1000.,
"vertexMode": "TRIANGLES",

"PASSES":[
  {
    "fs": "./camera.frag",
    "TARGET": "cameraTexture",
    "FLOAT": true,
  },
  {
      "vs": "sub.vert",
      "fs": "sub.frag",
      "BLEND": "ADD",
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;

varying vec4 v_color;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);


    gl_FragColor = vec4(color, 1.);
    gl_FragColor = v_color;
}
