/*{
"vertexCount": 10000.,
"vertexMode": "POINTS",

  "PASSES":[
    {
      "fs": "back.frag",
      "TARGET": "backTexture",
    },
    {
      "vs": "star.vert",
      "fs": "star.frag",
      "TARGET": "starTexture",
    },
    {
    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D backTexture;
uniform sampler2D starTexture;

const float PI = 3.14159265359;

void main(){
    // float t = mod(time, 10.);
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
    vec3 color = vec3(0.);

    if(PASSINDEX == 2){
      vec4 back = clamp(texture2D(backTexture, uv), 0., 1.);
      vec4 star = texture2D(starTexture, uv);
      gl_FragColor = (back.rgb != vec3(0.)) ? back + star : back;
    }
  }
