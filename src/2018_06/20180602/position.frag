/*{
  "vertexCount": 3600.,
  "vertexMode": "TRIANGLES",

  "PASSES": [
    {
      "fs": "camera.frag",
      "TARGET": "cameraTexture",
      "FLOAT": true,
    },
    {
      "vs": "./scene.vert",
    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;

void main(){
    float t = mod(time, 600.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);

    gl_FragColor = vec4(v_position.zzz, 0.);
}
