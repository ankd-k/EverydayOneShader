/*{
  pixelRatio: 1.,
  audio: true,
  "PASSES":[
    {
      fs: 'scene.frag',
      TARGET: 'sceneTexture',
    },
    {

    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D sceneTexture;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  vec4 scene = texture2D(sceneTexture, uv);

  gl_FragColor = scene;
}
