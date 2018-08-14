/*{
  "PASSES":[
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

uniform sampler2D mainTexture;

const float PI = 3.14159265359;

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;

  vec4 main = texture2D(mainTexture, uv);
  float brightness = dot(main.rgb, vec3(0.2126, 0.7152, 0.0722));
  // float luminance =
  //   main.r * 0.298912 +
  //   main.g * 0.586611 +
  //   main.b * 0.114478 ;
  // gl_FragColor = step(0.8, max(main.r, max(main.g, main.b))) * main;
  gl_FragColor = step(0.55, brightness) * main;

}
