/*{
audio: true,
pixelRatio: 2.,

"PASSES":[
  {
    fs: 'back.frag',
    TARGET: 'backTexture',
  },
  {
    fs: 'sub.frag',
    TARGET: 'subTexture',
  },
  {
    fs: 'main.frag',
    TARGET: 'mainTexture',
  },
  {

  },
],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D backTexture;
uniform sampler2D subTexture;
uniform sampler2D mainTexture;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec4 back = texture2D(backTexture, uv);
  vec4 sub = texture2D(subTexture, uv);
  vec4 main = texture2D(mainTexture, uv);

  color =
    0.<main.a ? main.rgb :
    0.5<sub.a ? sub.rgb : back.rgb;


  gl_FragColor = vec4(color, 1.);
}
