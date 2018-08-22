/*{
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
    {},
  ],
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform int PASSINDEX;
uniform sampler2D mainTexture;
uniform sampler2D brightnessTexture;
uniform sampler2D hBlurTexture;

const float PI = 3.14159265359;



void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float weight[5];
  weight[0] = 0.227027;
  weight[1] = 0.1945946;
  weight[2] = 0.1216216;
  weight[3] = 0.054054;
  weight[4] = 0.016216;

  vec2 tex_offset = 1./resolution;
  vec3 result = texture2D(brightnessTexture, uv).rgb;

  if(PASSINDEX==0){}
  else if(PASSINDEX==1){
    for(int i = 1; i < 5; ++i)
    {
      float fi = float(i);
      result += texture2D(brightnessTexture, uv + vec2(tex_offset.x * fi, 0.0)).rgb * weight[i];
      result += texture2D(brightnessTexture, uv - vec2(tex_offset.x * fi, 0.0)).rgb * weight[i];
    }
    gl_FragColor = vec4(result, 1.);
  }else{
    for(int i = 1; i < 5; ++i)
    {
      float fi = float(i);
      result += texture2D(hBlurTexture, uv + vec2(tex_offset.x * fi, 0.0)).rgb * weight[i];
      result += texture2D(hBlurTexture, uv - vec2(tex_offset.x * fi, 0.0)).rgb * weight[i];
    }
    gl_FragColor = vec4(result, 1.);
    // gl_FragColor = texture2D(mainTexture, uv);
    // gl_FragColor = texture2D(brightnessTexture, uv);
  }

}
