/*{
  audio: true,
}*/
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D spectrum;

const float PI = 3.14159265359;

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

  // color += freq[0] * sin(uv.x * 50. + t);
  // color.r += freq[0] * cos(uv.x *10.8 - t*5.3 + 3.9*sin(uv.y*8.3489 * sin(t*.3987 + uv.x*1.59) ));
  // color.g += freq[0] * cos(uv.x *10.8 - t*5.3 + 3.9*sin(uv.y*8.3489 * sin(t*.3987 + uv.x*1.59) ));
  // color.b += freq[0] * cos(uv.x *10.8 - t*5.3 + 3.9*sin(uv.y*8.3489 * sin(t*.3987 + uv.x*1.59) ));
  uv = uv*2.-1.;
  uv = abs(uv);
  uv = vec2(length(uv), atan(uv.y/uv.x));
  // color = vec3(freq[0]);
  color = vec3(texture2D(spectrum, uv + vec2(0.05*sin(uv.y*10.+t + sin(uv.y *12.89+t + 5.97*sin(uv.x*10.59 + t))))).r);
  // color = vec3(texture2D(spectrum, uv).r);

  gl_FragColor = vec4(color, 1.);
}
