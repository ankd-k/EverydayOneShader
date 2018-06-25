/*{
    "vertexCount": 360.,
    "vertexMode": "LINES",

    "PASSES":[
      {
        fs: "camera.frag",
        TARGET: "cameraTexture",
        FLOAT: true,
      },
      {
        vs: "main.vert",
        fs: "main.frag",
        TARGET: "mainTexture",
      },
      {
        fs: "back.frag",
        TARGET: "backTexture",
      },
      {

      },
    ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D mainTexture;
uniform sampler2D backTexture;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec4 main = texture2D(mainTexture, uv);
  vec4 back = texture2D(backTexture, uv);

  gl_FragColor = back*0.1;
  if(main.a>0.)gl_FragColor = main;
}
