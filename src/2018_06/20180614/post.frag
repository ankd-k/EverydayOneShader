/*{
  "vertexCount": 1000.,
  "vertexMode": "POINTS",

  "audio": true,

"PASSES":[
  {
    "fs": "./camera.frag",
    "TARGET": "cameraTexture",
    "FLOAT": true,
  },
  {
    "fs": "./main.frag",
    "TARGET": "mainTexture",
  },
  {
    "fs": "./sub.frag",
    "vs": "./sub.vert",
    "TARGET": "subTexture",
  },
  {
    "fs": "./back.frag",
    "TARGET": "backTexture",
  },
  {
    "fs": "scene.frag",
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    gl_FragColor = vec4(color, 1.);
}
