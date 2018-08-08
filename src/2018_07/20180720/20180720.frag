/*{
  frameskip: 1.,
  pixelRatio: 1.,
  'camera': true,

  "PASSES":[
    {
      fs: 'buff.frag',
      TARGET: 'buffTexture',
    },
    {
      fs: 'pre.frag',
      TARGET: 'preTexture',
    },
    {

    },
  ],
}*/
#extension GL_OES_standard_derivatives : enable// need to use fwidth function

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D camera;
uniform sampler2D backbuffer;

uniform sampler2D buffTexture;
uniform sampler2D preTexture;

const float PI = 3.14159265359;

float usin(float x){
  return 0.5+0.5*sin(x);
}

vec4 gray(vec4 src){
  float r = 0.298912;
  float g = 0.586611;
  float b = 0.114478;
  return vec4(vec3(dot(src.rgb, vec3(r,g,b))), src.a);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);


  vec2 st = uv;
  for(int i=0;i<3;i++){
    st.x += usin(st.y * 4.34564 + time + sin(st.x * 10.676 + time));
    st.y += usin(st.x * 2.57489 + time + sin(st.y * 10.676 + time));
  }

  color = vec3(usin(st.x + t), usin(st.y + t), usin(st.x*0.83897 + t*5.264));

  vec4 buff = texture2D(buffTexture, uv);
  vec4 pre = texture2D(preTexture, uv);

  gl_FragColor = (pre-buff) * vec4(color, 1.);
  gl_FragColor += texture2D(backbuffer, uv)*0.99;
  // gl_FragColor = vec4(0.);
}
