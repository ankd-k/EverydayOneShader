/*{
  "audio": true,
  "vertexCount": 300.,
  "vertexMode": "TRIANGLES",

"PASSES":[
  {
    "fs": "camera.frag",
    "TARGET": "cameraTexture",
    "FLOAT": true,
  },
  {
    "fs": "back.frag",
    "TARGET": "backTexture",
  },
  {
    "fs": "main.frag",
    "vs": "main.vert",
    "TARGET": "mainTexture",
  },
  {
    "fs": "sub.frag",
    "vs": "sub.vert",
    "TARGET": "subTexture",
    "BLEND": "ADD",
  },
  {
    // "fs" : "scene.frag",
  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D backTexture;
uniform sampler2D mainTexture;
uniform sampler2D subTexture;

const float PI = 3.14159265359;

void main(){
    float t = mod(time, 60.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    vec4 back = texture2D(backTexture, uv);
    vec4 main = texture2D(mainTexture, uv);
    vec4 sub = texture2D(subTexture, uv);

    gl_FragColor = vec4(0.);
    gl_FragColor += back;
    gl_FragColor += main;
    if(length(main.rgb) < (0.001)){
      gl_FragColor += texture2D(subTexture, uv);
    }

}
