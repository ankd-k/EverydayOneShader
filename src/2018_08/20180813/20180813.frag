/*{
  pixelRatio: 1.,
  audio: true,
  "PASSES":[
    {
      fs: 'main.frag',
      TARGET: 'mainTexture',
    },
    {
      fs: 'brightness.frag',
      TARGET: 'brightnessTexture',
    },
    {
      fs: 'blur.frag',
      TARGET: 'hBlurTexture',
    },
    {
      fs: 'blur.frag',
      TARGET: 'blurTexture',
    },
    {

    }
  ],
}*/
#extension GL_OES_standard_derivatives : enable// need to use fwidth function
precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D mainTexture;
uniform sampler2D brightnessTexture;
uniform sampler2D blurTexture;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
  float t = mod(time, 600.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  // main
  vec4 main = texture2D(mainTexture, uv);
  gl_FragColor = main;

  // blur
  vec4 blur = texture2D(blurTexture, uv);
  blur = clamp(blur, 0., 1.);
  gl_FragColor += blur * usin(t*PI) * 1.;

  //gamma
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1./2.2));
}
