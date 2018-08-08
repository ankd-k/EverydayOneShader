/*{
  pixelRatio: 2.,
  'camera': true,
}*/
#extension GL_OES_standard_derivatives : enable// need to use fwidth function

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D camera;

uniform int FRAMEINDEX;

const float PI = 3.14159265359;

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

  if(FRAMEINDEX==0) {
    gl_FragColor = vec4(0.);
    return;
  }
  // gl_FragColor = vec4(color, 1.);
  vec4 cam = texture2D(camera, uv);
  float gr = gray(cam).r;
  float edge = step(0.05, length(vec2(dFdx(gr), dFdy(gr))));
  // start getting edge
  // color = texture2D(camera, uv).rgb;
  // float gray = length(color);
  // float edge = step(0.015+0.03*(0.5+0.5*sin(t*0.5)), length(vec2(dFdx(gray), dFdy(gray))));
  // end getting edge


  vec4 src = pow(clamp(gray(cam)* 1.2/length(p), 0., 1.), vec4(vec3(5.), 1.));// + vec4(edge);
  src *= vec4(edge);
  // vec4 res = abs(src-texture2D(backbuffer, uv));
  gl_FragColor = src;
  // gl_FragColor * 0.5/length(p);
}
