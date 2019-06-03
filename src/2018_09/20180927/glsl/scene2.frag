/*{
  audio: true,
  "PASSES":[
    {
      fs: 'scene0.frag',
      TARGET: 'tex0',
    },
    {

    },
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float PI = 3.14159265359;

uniform sampler2D tex0;

uniform float volume;

void main(){
  float t = mod(time-0.4, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // uv *= mod(floor(t*2.), 4.)+1.;
  uv = fract(uv);

  vec4 scene;
  float w = volume/255.;
  w *= 0.1;
  scene.r = texture2D(tex0, uv-vec2(0.1*sin(10.*uv.y+time), w)).r;
  scene.g = texture2D(tex0, uv-vec2(0., 0.02)).g;
  scene.b = texture2D(tex0, uv-vec2(0., -w*cos(time))).b;
  scene.a = texture2D(tex0, uv).a;

  gl_FragColor = scene;
}
