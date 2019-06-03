/*{

}*/
precision highp float;

// basic
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform int FRAMEINDEX;
// audio
uniform float volume;
uniform sampler2D samples;
uniform sampler2D spectrum;
// midi
uniform sampler2D midi;
uniform sampler2D note;

const float PI = 3.14159265359;



void main(){
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 col = vec3(0.);

  float height = -0.4;
  float rot = time*0.1;
  float dist = 9.0+1.0*sin(0.5*time);
  vec3 ro = dist * vec3(cos(rot), height, sin(rot));
  vec3 ta = vec3(0.);
  vec3 fw = normalize(ta - ro);



  gl_FragColor = vec4(col, 1.);
}
