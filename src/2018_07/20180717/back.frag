/*{
  audio: true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;

const float PI = 3.14159265359;

float random(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414)))*43213.98979);
}

float usin(float x){
  return 0.5+0.5*sin(x);
}

void main(){
  float t = mod(time, 60.);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 p = (gl_FragCoord.xy*2.-resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.);

  float freq[10];
  freq[0] = texture2D(spectrum, vec2(0.03, 0.)).r;
  freq[1] = texture2D(spectrum, vec2(0.1, 0.)).r;
  freq[2] = texture2D(spectrum, vec2(0.2, 0.)).r;
  freq[3] = texture2D(spectrum, vec2(0.3, 0.)).r;
  freq[4] = texture2D(spectrum, vec2(0.4, 0.)).r;
  freq[5] = texture2D(spectrum, vec2(0.5, 0.)).r;
  freq[6] = texture2D(spectrum, vec2(0.6, 0.)).r;
  freq[7] = texture2D(spectrum, vec2(0.7, 0.)).r;
  freq[8] = texture2D(spectrum, vec2(0.8, 0.)).r;
  freq[9] = texture2D(spectrum, vec2(0.9, 0.)).r;

  uv *= 10.;
  vec2 num = floor(uv);
  uv = fract(uv);

  float rand = random(num);

  color += usin(rand*4.98+t*40.8*sin(rand));
  color = pow(color, vec3(4.)) * 0.5;


  gl_FragColor = vec4(color, 1.);
}
